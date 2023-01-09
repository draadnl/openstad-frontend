/**
 * Display a map with location for an idea,
 * needs to be on an (old) idea page or resource page with type idea
 */
const styleSchema = require('../../../config/styleSchema.js').default;
const openstadMap = require('../../../config/map').default;

const fields = [
  styleSchema.definition('containerStyles', 'Styles for the container')
];

module.exports = {
  extend: 'map-widgets',
  label: 'Event location',
  addFields: fields,
  construct: function(self, options) {
     let classIdeaId;

    // Add mapConfig to playerData so it can be used in javascript
    options.playerData = ['mapConfig']

     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('script', 'main', { when: 'always' });
     };

      const superLoad = self.load;
      self.load = function (req, widgets, next) {
          const styles = openstadMap.defaults.styles;
          const globalData = req.data.global;
          const siteConfig = req.data.global.siteConfig;
          widgets.forEach((widget) => {
              if (widget.containerStyles) {
                const containerId = self.apos.utils.generateId();
                widget.containerId = containerId;
                  widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
              }

              widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';


              widget.siteConfig = {
                  minimumYesVotes: (siteConfig && siteConfig.ideas && siteConfig.ideas.minimumYesVotes),
                  voteValues: (siteConfig && siteConfig.votes && siteConfig.votes.voteValues) || [{
                      label: 'voor',
                      value: 'yes'
                  }, {label: 'tegen', value: 'no'}],
              }
              if (widget.siteConfig.minimumYesVotes == null || typeof widget.siteConfig.minimumYesVotes == 'undefined') widget.siteConfig.minimumYesVotes = 100;

              const markerStyle = siteConfig.openStadMap && siteConfig.openStadMap.markerStyle ? siteConfig.openStadMap.markerStyle : null;

              // Todo: refactor this to get ideaId in a different way
              const ideaId = req.url
                  .replace(/(\/.*\/)/, '')
                  .replace(/\?.*/, '');

              const idea = req.data.activeResource ? req.data.activeResource : null;
              const ideas = idea ? [idea] : [];
              
              console.log('<=== idea', idea, req.data.activeResource);

              widget.mapConfig = self.getMapConfigBuilder(globalData)
                  .setDefaultSettings({
                      mapCenterLat: (idea && idea.location && idea.location.coordinates && idea.location.coordinates[0]) || globalData.mapCenterLat,
                      mapCenterLng: (idea && idea.location && idea.location.coordinates && idea.location.coordinates[1]) || globalData.mapCenterLng,
                      mapZoomLevel: 16,
                      zoomControl: true,
                      disableDefaultUI : true,
                      styles: styles
                  })
                  .setMarkersByResources(ideas)
                  .setMarkerStyle(markerStyle)
                  .setPolygon(req.data.global.mapPolygons || null)
                  .getConfig()

          });
          return superLoad(req, widgets, next);
      }
      
      const superOutput = self.output;
      self.output = function(widget, options) {
        console.log ('<=== event location output before', options.activeResource);
        if (options.activeResource) {
          const idea = options.activeResource;
          widget.mapConfig = self.getMapConfigBuilder(globalData)
                  .setDefaultSettings({
                      mapCenterLat: (idea && idea.location && idea.location.coordinates && idea.location.coordinates[0]) || globalData.mapCenterLat,
                      mapCenterLng: (idea && idea.location && idea.location.coordinates && idea.location.coordinates[1]) || globalData.mapCenterLng,
                      mapZoomLevel: 16,
                      zoomControl: true,
                      disableDefaultUI : true,
                      styles: styles
                  })
                  .setMarkersByResources(ideas)
                  .setMarkerStyle(markerStyle)
                  .setPolygon(req.data.global.mapPolygons || null)
                  .getConfig()
          
          widget.mapConfig = JSON.stringify(widget.mapConfig);
          
          console.log ('<=== event location output', widget.mapConfig, options.activeResource);
        }
        return superOutput(widget, options);
      };

  }
};
