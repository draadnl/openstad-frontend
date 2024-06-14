/**
 * Customizing Apostrophe Global settings
 *
 * Be aware that apostropheCMS puts all global settings in the HTML source so global fields are not suited for sensitive settings
 */
const auth              = require('basic-auth');
const compare           = require('tsscmp');
const fs     = require('fs');
const fields            = require('./lib/fields');
const arrangeFields     = require('./lib/arrangeFields');

function unauthorized(req, res) {
    var challengeString = 'Basic realm=Openstad';
    res.set('WWW-Authenticate', challengeString);
    return res.status(401).send('Authentication required.');
}


module.exports = {
  improve: 'apostrophe-global',
  addFields: fields,
  afterConstruct: function(self) {
    self.expressMiddleware.push(self.overrideGlobalDataWithSiteConfig);
  },
  construct: function (self, options) {
    require('./lib/api')(self, options);

    self.on('apostrophe:modulesReady', 'setSyncFields');
    self.on('apostrophe-docs:beforeSave', 'formatGlobalFields');
    self.on('apostrophe-docs:afterSave', 'syncApi');
    self.on('apostrophe-docs:afterSave', 'clearCache');

    options.arrangeFields = arrangeFields.concat(options.arrangeFields || []);

    self.apos.app.use((req, res, next) => {

      req.data.global = req.data.global ? req.data.global : {};

      const siteConfig = self.apos.settings.getOption(req, 'siteConfig');

      /**
       * Run basic-auth middleware.
       * TODO: move to it's own lib modules
       */
      let ignore_paths = ['/attachment-upload']; // TODO: configurable
      if (siteConfig && siteConfig.basicAuth && siteConfig.basicAuth.active && !ignore_paths.includes(req.path)) {
        var user = auth(req);

        if (!user || !compare(user.name, siteConfig.basicAuth.user) || ! compare(user.pass, siteConfig.basicAuth.password)) {
          unauthorized(req, res);
        } else {
          next();
        }

      } else {
        next();
      }
    });

    self.apos.app.use((req, res, next) => {
      const siteConfig = self.apos.settings.getOption(req, 'siteConfig');
      // load env sheets that have been set for complete Environment, not just one site specific
      if (process.env.STYLESHEETS) {
        const sheets = process.env.STYLESHEETS.split(',');
        req.data.envStyleSheets = sheets;
      }

      // Add current language to the global data
      if (self.apos.i18n) {
        req.data.global.locale = self.apos.i18n.getLocale();
      } else if (self.apos.workflow) {
        req.data.global.locale = self.apos.workflow.lang();
      }

      if (req.data.global.locale === 'default') {
        req.data.global.locale = 'nl';
      }

      // Append the title of the current piece/page/resource to the site logo alt text
      // As per recommendation of the accessibility audit
      let appendTitle = '';
      if (req.data.piece) {
        appendTitle = req.data.piece.title;
      } else if (req.data.page) {
        if (req.data.page.metaTitle) {
          appendTitle = req.data.page.metaTitle;
        } else if (req.data.activeResource && req.data.activeResource.title) {
          appendTitle = req.data.activeResource.title;
        } else if (req.data.page && req.data.page.title) {
          appendTitle = req.data.page.title;
        }
      }


      if (appendTitle) {
        req.data.global.siteLogoAltText = req.data.global.siteLogoAltText ? `${req.data.global.siteLogoAltText}, ${appendTitle}` : `${data.global.siteTitle}, ${appendTitle}`;
      }

      //for legacy purposes, remove to better solutions at some point
      //Amsterdam
      //
      if (!req.data.global.siteLogo && process.env.LOGO_AMSTERDAM && process.env.LOGO_AMSTERDAM === 'yes') {
        //make sure we
        req.data.global.siteLogo = 'amsterdam';
      }

      req.data.global.siteConfig = {
        ideas: siteConfig.ideas,
        polls: siteConfig.polls,
        votes: siteConfig.votes,
        area: siteConfig.area,
        arguments:siteConfig.arguments,
        openstadMap:siteConfig.openstadMap,
      };

      req.data.originalUrl = req.originalUrl;

      // backwards compatibility for analytics
      // TODO: is there a way to use the value of an old field as default for a new field?
      if (typeof req.data.global.analyticsType == 'undefined' || ( req.data.global.analyticsType == 'google-analytics-old-style' && req.data.global.analyticsIdentifier == '' && req.data.global.analytics ) ) {
        req.data.global.analyticsType = 'google-analytics-old-style';
        req.data.global.analyticsIdentifier = req.data.global.analytics;
      }

      // Set the siteTitle as sensible default for the logo alt text
      req.data.global.siteLogoAltText = req.data.global.siteLogoAltText || req.data.global.siteTitle;

      // get the identifier for making sure that the custom js/css files we load in also bust the cache
      req.data.assetsGeneration = fs.existsSync('data/generation') ? fs.readFileSync('data/generation').toString().trim() : Math.random().toString(36).slice(-5);
      //add query tot data object, so it can be used in templates
      req.data.query = req.query;

      next();
    });

  }
};
