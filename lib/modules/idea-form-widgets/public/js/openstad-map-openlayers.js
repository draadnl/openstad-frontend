// Todo: refactor this check
if (typeof mapConfigSetting !== "undefined" && mapConfigSetting === "openlayers") {
    var nlMapsHolder = document.getElementById('nlmaps-holder');
    nlMapsHolder.style.height = '400px'; // Change to required height

    const GeoJSON = ol.format.GeoJSON;
    const VectorLayer = ol.layer.Vector;
    const VectorSource = ol.source.Vector;
    const Style = ol.style.Style;
    const Fill = ol.style.Fill;
    const Stroke = ol.style.Stroke;
    const MultiPoint = ol.geom.MultiPoint;
    const Marker = nlmaps.openlayers.markerLayer;
    const fromLonLat = ol.proj.fromLonLat;
    const View = ol.View;

    const OpenlayersMap = {
        map: null,
        marker: null,
        options: {
            style: 'standaard',
            target: 'nlmaps-holder',
            center: {
                longitude: openstadMapDefaults.center.lng,
                latitude: openstadMapDefaults.center.lat
            },
            overlay: 'gebouwen',
            search: false,
            zoom: openstadMapDefaults.zoom
        },
        init: function () {

            if(markerLocation) {
                this.options.center = {
                    longitude: markerLocation.coordinates[1] || openstadMapDefaults.center.lng,
                    latitude: markerLocation.coordinates[0] || openstadMapDefaults.center.lat
                }
            }

            this.createMap(this.options);
            this.addPolygon();
            this.setIdeaMarker();

            this.addEventListener();
        },
        setIdeaMarker: function () {
            //Add marker if present
            if (markerLocation) {
                var coordinate = [markerLocation.coordinates[1], markerLocation.coordinates[0]];
                this.addMarker(coordinate);
            }
        },
        createMap: function (options) {
            this.map = nlmaps.createMap(options);

            return this.map;
        },
        addMarker: function (latLong) {
            this.removeMarkers();

            var marker = new ol.Feature({
                geometry: new ol.geom.Point(
                    ol.proj.fromLonLat(latLong)
                ),
            });
            marker.setStyle(new ol.style.Style({
                image: new ol.style.Icon(({
                    crossOrigin: 'anonymous',
                    src: '/img/idea/flag-blue-dh.svg'
                }))
            }));
            var vectorSource = new VectorSource({
                features: [marker]
            });
            var vectorLayer = new VectorLayer({
                source: vectorSource
            });

            this.marker = vectorLayer;

            this.map.addLayer(vectorLayer);
        },
        addEventListener: function () {
            var self = this;
            if (this.marker === null) {
                this.map.on('click', function (event) {

                    var latLong = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
                    var coordinate = {
                        latitude: latLong[1],
                        longitude: latLong[0]
                    };

                    self.addMarker(latLong);

                    var point = {type: 'Point', coordinates: [coordinate.latitude, coordinate.longitude]};
                    var coordinateValue = JSON.stringify(point);

                    editorInputElement.value = coordinateValue;
                }, 'click');
            }
        },
        addPolygon: function () {
            var polygonCoords = [];
            polygonLngLat.forEach(function (pointPair) {
                var newPair = ol.proj.fromLonLat([pointPair.lng, pointPair.lat], 'EPSG:3857');
                polygonCoords.push(newPair);
            });

            var geojsonObject = {
                'type': 'FeatureCollection',
                'crs': {
                    'type': 'name',
                    'properties': {
                        'name': 'EPSG:3857'
                    }
                },
                'features': [{
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [polygonCoords]
                    }
                }]
            };

            var source = new VectorSource({
                features: (new GeoJSON()).readFeatures(geojsonObject)
            });

            var styles = [
                new Style({
                    stroke: new Stroke({
                        color: 'black',
                        width: 3
                    }),
                    fill: new Fill({
                        color: 'rgba(0, 0, 0, 0.1)'
                    })
                }),
                new Style({
                    geometry: function (feature) {
                        // return the coordinates of the first ring of the polygon
                        var coordinates = feature.getGeometry().getCoordinates()[0];
                        return new MultiPoint(coordinates);
                    }
                })
            ];

            var layer = new VectorLayer({
                source: source,
                style: styles
            });

            this.map.addLayer(layer);
        },
        removeMarkers: function () {
            this.map.removeLayer(this.marker);
        }
    };

    OpenlayersMap.init();

    document.addEventListener("DOMContentLoaded", function () {
        $('.ol-viewport').append($('.nlmaps-geocoder-control-container'));
    });
}