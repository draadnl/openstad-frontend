const styleSchema = require('../../../config/styleSchema.js').default;
const merge = require('merge');

const { fields, arrangeFields } = require('./lib/fields');
const createConfig = require('./lib/create-config');

let styleSchemaDefinition = styleSchema.definition('containerStyles', 'Styles for the container');

module.exports = {
  extend: 'openstad-widgets',
  label: 'OpenStad Components Base widget',
  addFields: fields.concat(styleSchemaDefinition),
  beforeConstruct: function(self, options) {
    options.addFields = fields.concat(options.addFields || []);
  },
  playerData: ['config', 'OpenStadComponentsCdn', 'activeResourceId'],
  construct: function(self, options) {

    const superPushAssets = self.pushAssets;
    self.pushAssets = function () {
      superPushAssets();
      self.pushAsset('script', 'main', {when: 'always'});
    };

    options.arrangeFields = (options.arrangeFields || []).concat( arrangeFields );

    const superLoad = self.load;
    self.load = function(req, widgets, next) {

      const siteUrl = self.apos.settings.getOption(req, 'siteUrl');
      let imageProxy = siteUrl + '/image';

      widgets.forEach((widget) => {

        let config = createConfig({
          widget: widget,
          data: req.data,
          jwt: req.session.jwt,
          apiUrl: self.apos.settings.getOption(req, 'apiUrl'),
          loginUrl: req.data.siteUrl + '/oauth/login?{returnTo}',
          imageProxy: imageProxy,
        });
        widget.config = merge.recursive(config, widget.config);
        widget.config = merge.recursive(config, widget.config);
        widget.config = JSON.stringify(config);

        widget.OpenStadComponentsCdn = (req && req.data && req.data.global && req.data.global.openstadComponentsUrl) || self.apos.settings.getOption(req, 'siteConfig').openstadComponentsCdn;

        const containerId = self.apos.utils.generateId();
        widget.containerId = containerId;
        widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';
        widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);

      });
      
      return superLoad(req, widgets, next);
    }

    self.optionsPlayerData =  ['activeResourceId'];
    const superFilterOptionsForDataAttribute = self.filterOptionsForDataAttribute;
    self.filterOptionsForDataAttribute = function(options) {
      options.OpenstadComponentsCdn = self.openstadComponentsCdn;
      return superFilterOptionsForDataAttribute(options);
    };

    const superOutput = self.output;
    self.output = function(widget, options) {
      return superOutput(widget, options);
    };

  }
};
