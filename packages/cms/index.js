require('dotenv').config();
const _ = require('lodash');
const { readdirSync } = require('fs');
const openstadApp = require('./app');

module.exports.getDefaultConfig = (options) => {
  return openstadApp.getDefaultConfig(options);
};

module.exports.getSingleApp = () => {
  return openstadApp.getApostropheApp();
};

module.exports.site = (options) => {

  const app = openstadApp.getMultiSiteApp(options);
  const server = app.listen(process.env.PORT);
  
  server.on('listening', () => {
    openstadApp.startSites();
  });

};

const getDirectories = source => readdirSync(source).filter(name => name.indexOf('apostrophe') <= -1);

module.exports.moogBundle = {
  modules: getDirectories(__dirname + '/lib/modules'),
  directory: 'lib/modules'
};
