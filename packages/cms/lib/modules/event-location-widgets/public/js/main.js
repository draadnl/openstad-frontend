apos.define('event-location-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.playAfterlibsLoaded = function($widget, data, options) {
            console.log('<=== playAfterlibsLoaded event-location-widgets', $widget, data, options, data.activeResource, options.activeResource)
            var map = self.createMap(data.mapConfig);
            self.addPolygon(data.mapConfig);
            self.setIdeaMarker(data.mapConfig);
            self.center();
        }
    }
});
