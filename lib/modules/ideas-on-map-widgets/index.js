const styleSchema = require('../../../config/styleSchema.js').default;
const fs = require('fs');
const openstadComponentsUrl = process.env.OPENSTAD_COMPONENTS_URL || '/openstad-components';
const imageApiUrl   = process.env.IMAGE_API_URL;
const imageApiToken = process.env.IMAGE_API_ACCESS_TOKEN;
const rp = require('request-promise');

const fields = require('./lib/fields');
const createConfig = require('./lib/create-config');

let styleSchemaDefinition = styleSchema.definition('containerStyles', 'Styles for the container');

module.exports = {
  extend: 'openstad-widgets',
  label: 'Kaart applicatie',
  addFields: fields.concat(styleSchemaDefinition),
  construct: function(self, options) {

    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'Algemeen',
        fields: ['displayType', 'displayWidth', 'displayHeight', 'linkToCompleteUrl', 'ideaName', 'typeField', 'typeLabel', 'typesFilterLabel', 'startWithListOpenOnMobile']
      },
      {
        name: 'map',
        label: 'Kaart',
        fields: ['mapVariant', 'mapAutoZoomAndCenter', 'mapClustering', 'mapMaxClusterRadius', 'canSelectLocation' ]
      },
      {
        name: 'content',
        label: 'Content',
        fields: ['linkToUserPageUrl', 'noSelectionLoggedInHTML', 'noSelectionNotLoggedInHTML', 'showNoSelectionOnMobile', 'selectionActiveLoggedInHTML', 'selectionInactiveLoggedInHTML', 'mobilePreviewLoggedInHTML', 'selectionActiveNotLoggedInHTML', 'selectionInactiveNotLoggedInHTML', 'mobilePreviewNotLoggedInHTML']
      },
      {
        name: 'sort',
        label: 'Sorteren',
        fields: ['selectedSorting', 'defaultSorting']
      },
      {
        name: 'idea-details',
        label: 'Idee details',
        fields: ['showShareButtons', 'shareChannelsSelection']
      },
      {
        name: 'reactions',
        label: 'Reacties',
        fields: ['showReactions', 'reactionsTitle', 'reactionsPlaceholder', 'reactionsFormIntro', 'ignoreReactionsForIdeaIds', 'closeReactionsForIdeaIds', ]
      },
      {
        name: 'idea-form',
        label: 'Idee formulier',
        fields: ['formUrl', 'formFields']
      },
    ]);

    const superPushAssets = self.pushAssets;
		self.pushAssets = function () {
			superPushAssets();
    };

    const superLoad = self.load;
		self.load = function(req, widgets, next) {

			widgets.forEach((widget) => {
			  
			  widget.config = JSON.stringify(createConfig(widget, req.data, req.session.jwt, self.apos.settings.getOption(req, 'appUrl')));
        widget.openstadComponentsUrl = openstadComponentsUrl;
        
        const containerId = widget._id;
        widget.containerId = containerId;
        widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);

      });
      
			return superLoad(req, widgets, next);
			next();
		}

    const superOutput = self.output;
    self.output = function(widget, options) {
      return superOutput(widget, options);
    };

  }
};
