const rp = require('request-promise');
const Url = require('url');
const apiLogoutUrl = process.env.API_LOGOUT_URL;
const internalApiUrl = process.env.INTERNAL_API_URL;

function removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {

        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i = pars.length; i-- > 0;) {
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
}

module.exports = {
  construct: function(self, options) {
  // You can add routes here
    self.expressMiddleware = {
      when: 'afterRequired',
      middleware: (req, res, next) => {
        self.authenticate(req, res, next);
      }
    };

    self.authenticate = (req, res, next) => {

      if (req.query.jwt) {
        // redirect to returnTo if set!
        //
        const thisHost = req.headers['x-forwarded-host'] || req.get('host');
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const fullUrl = protocol + '://' + thisHost + req.originalUrl;
        const parsedUrl = Url.parse(fullUrl, true);
        let fullUrlPath = parsedUrl.path;

        // remove the JWT Parameter otherwise keeps redirecting
        let returnTo = req.session.returnTo ? req.session.returnTo : removeURLParameter(fullUrlPath, 'jwt');
        // make sure reference to external urls fail
        returnTo = Url.parse(returnTo, true);
        returnTo = returnTo.path;
        req.session.jwt = req.query.jwt;
        req.session.returnTo = null;

        req.session.save(() => {
          res.redirect(returnTo);
          return;
        });
      } else {
        const jwt = req.session.jwt;
        const apiUrl = internalApiUrl ? internalApiUrl : self.apos.settings.getOption(req, 'apiUrl');

        if (!jwt) {
          next();
        } else {

				let url = req.data.global.siteId ? `${apiUrl}/oauth/site/${req.data.global.siteId}/me` : `${apiUrl}/oauth/me`;

        var options = {
             uri: url,
             headers: {
                 'Accept': 'application/json',
                 "X-Authorization" : `Bearer ${jwt}`,
                 "Cache-Control": "no-cache"
             },
             json: true // Automatically parses the JSON string in the response
         };

         rp(options)
           .then(function (user) {
             if (user.id === 1) {
                user = undefined;
             }

             if (user) {
               req.data.loggedIn = user &&  user.role !== 'anonymous';
               req.data.openstadUser = user;
               req.data.isAdmin = user.role === 'admin'; // user;

               req.session.save(() => {
                 if (req.data.isAdmin) {

                   if(!req.data.global.siteId) {
                     console.log('no site id');
                     return next();
                   }

                   rp({
                       uri: `${apiUrl}/api/site/${req.data.global.siteId}/vote`,
                       headers: {
                           'Accept': 'application/json',
                           "X-Authorization" : `Bearer ${jwt}`,
                           "Cache-Control": "no-cache"
                       },
                       json: true // Automatically parses the JSON string in the response
                   })
                   .then(function (votes) {
                     req.data.votes = votes;
                     next();
                   })
                   .catch((e) => {
                     console.log('===> e', e);
                     next();
                     return null;
                   });

                 }  else {
                   next();
                 }

               });




             } else {
               // if not valid clear the JWT and redirect
               req.session.jwt = '';
               req.session.save(() => {
                 res.redirect('/');
                 return;
               })
             }

           })
           .catch((e) => {
             // if not valid clear the JWT and redirect
             req.session.jwt = '';
             req.session.save(() => {
               res.redirect('/');
               return;
             })
           });

         }
      }
    };

    self.apos.app.get('/oauth/logout', (req, res, next) => {
      req.session.destroy(() => {
        const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
        const thisHost = req.headers['x-forwarded-host'] || req.get('host');
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const fullUrl = protocol + '://' + thisHost;
        const url = apiUrl + '/oauth/site/'+req.data.global.siteId+'/logout?redirectUrl=' + fullUrl;
        res.redirect(url);
      });
    });

    self.apos.app.get('/oauth/login', (req, res, next) => {
        let referer = req.headers.referer ? req.headers.referer : null;
        req.session.returnTo = req.query.returnTo ?  decodeURIComponent(req.query.returnTo) : referer;

        req.session.save(() => {
          const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
          const thisHost = req.headers['x-forwarded-host'] || req.get('host');
          const protocol = req.headers['x-forwarded-proto'] || req.protocol;
          let returnUrl = protocol + '://' + thisHost;

          if (req.session.returnTo) {
            let pathToReturnTo = Url.parse(req.session.returnTo, true);
            pathToReturnTo = pathToReturnTo.path;
            returnUrl = returnUrl + pathToReturnTo;
          }

          let url = `${apiUrl}/oauth/site/${req.data.global.siteId}/login?redirectUrl=${returnUrl}&forceNewLogin=1`;
          url = req.query.useOauth ? url + '&useOauth=' + req.query.useOauth : url;
          res.redirect(url);
        });
    });
  }
};
