Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LayerConfig = Backbone.Model.extend({
    // static variable.
    styleObj: {},

    defaults: {
        id: null,
        layer: null,
        initialOrder: null,
        scaleDependent: null,
        data: null,
        loaded: false,
        // Will be only visible when the user activates the layer in the TOC,
        // and will only be toggled by the user toc actions
        initialVisible: true,
        // Should be set to true when the user makes the layer visible in the
        // TOC. A to false when the layer visibility is unchecked.
        usersControlsVisibility: false,
        /*
    To be used when the Leaflet.AlmostOver plugin is present.
    https://github.com/makinacorpus/Leaflet.AlmostOver
    Sets a listener that will be triggered when the user almost click on
    the layer. Useful to open poppup in lines and point layer where is
    difficult to click really on the path
    */
        almostOver: false,
    },

    initialize: function(options) {
        if (!this.get("layer")) {
            var geojsonOptions = {};

            if (this.get("style")) {
                if (this.get("style") === true) {
                    geojsonOptions.style = this.styleObj["doStyle" + this.id()];
                } else {
                    var style = this.get("style");
                    style = typeof style === "object" ? style : window[style];
                    geojsonOptions.style = style;
                }
            }

            if (this.get("pointToLayer")) {
                if (this.get("pointToLayer") === true) {
                    geojsonOptions.pointToLayer = this.styleObj[
                        "doPointToLayer" + this.id()
                    ];
                } else {
                    // FIXME
                    geojsonOptions.pointToLayer = window[this.get("pointToLayer")];
                }
            }

            if (this.get("onEachFeature")) {
                if (this.get("onEachFeature") === true) {
                    geojsonOptions.onEachFeature = this.styleObj[
                        "onEachFeature" + this.id()
                    ];
                } else {
                    geojsonOptions.onEachFeature = window[this.get("onEachFeature")];
                }
            }

            if (this.get("data") === true) {
                this.get("data") === window["json_" + this.id()];
            }

            this.calculateScaleDependent();

            this.set("layer", new L.geoJson(this.get("data"), geojsonOptions));

            if (this.get("data") !== null) {
                this.set("loaded", true);
                if (this.get("almostOver")) {
                    // FIXME. We are using map as global
                    map.almostOver.addLayer(this.get("layer"));
                }
            }
        }
    },

    calculateScaleDependent: function() {
        var scaleDependent = this.get("scaleDependent");
        var farZoom = this.get("farZoom");
        var closeZoom = this.get("closeZoom");
        var minScale = this.get("minScale");
        var maxScale = this.get("maxScale");

        if (
            scaleDependent ||
            farZoom ||
            closeZoom ||
            closeZoom ||
            minScale ||
            maxScale
        ) {
            scaleDependent = scaleDependent || {};
            scaleDependent.farZoom = farZoom || this.scaleToZoom(minScale) || -1;
            scaleDependent.closeZoom =
                closeZoom || this.scaleToZoom(maxScale) || Number.MAX_VALUE;
            this.set("scaleDependent", scaleDependent);
        }
    },

    scaleToZoom: function(scale) {
        switch (scale) {
            case 5000000:
                return 7;
            case 2500000:
                return 8;
            case 1250000:
                return 9;
            case 1000000:
            case 750000:
                return 10;
            case 250000:
                return 12;
            case 100000:
                return 13;
            default:
                return null;
        }
    },

    isVisible: function(zoom, feature_group, layer) {
        var scaleDependent = this.get("scaleDependent");
        var initialVisible = this.get("initialVisible");
        var usersControlsVisibility = this.get("usersControlsVisibility");

        if (usersControlsVisibility) {
            // Si el usuario ha hecho click en la capa, pasa a controlar el mismo
            // su visibilidad.
            return feature_group.hasLayer(layer);
        }

        if (!initialVisible) {
            /*
    Si el usuario no ha activado la capa y la marcamos como
    "en principio invisible", independientemente de la escala
    no debemos mostrarla
    */
            return false;
        }

        if (scaleDependent) {
            /*
    Si la capa depende de la escala, será visible cuando el zoom sea
    el adecuado
    */
            return scaleDependent.farZoom <= zoom && zoom <= scaleDependent.closeZoom;
        }

        return true;
    },

    loadWithAjax: function() {
        var url = "data/" + this.get("id") + ".json";
        var self = this;
        $.getJSON(url, function(data) {
            self.get("layer").clearLayers();
            self.get("layer").addData(data);
            if (self.get("almostOver")) {
                // FIXME. We are using map as global
                map.almostOver.addLayer(self.get("layer"));
            }
            self.set("loaded", true);
            self.trigger("layerloaded");
        });
    },
});

Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LayerConfigCollection = Backbone.Collection.extend({
    model: Backbone.SIXHIARA.LayerConfig,
    comparator: "initialOrder",

    filterByZoom: function(zoom) {
        // https://github.com/Leaflet/Leaflet/issues/2086
        // http://stackoverflow.com/a/31104813/930271
        // http://stackoverflow.com/questions/12848812/layer-ordering-in-leaflet-js
        // http://jsfiddle.net/nathansnider/7r763xaq/
        return this.filter(function(layer) {
            var scaleDependent = layer.get("scaleDependent");
            return (
                !scaleDependent ||
                (scaleDependent.farZoom <= zoom && zoom <= scaleDependent.closeZoom)
            );
        });
    },

    load: function(data) {
        data = data || {loadType: "all"};
        var self = this;
        if (data.loadType === "all") {
            this.forEach(function(l) {
                l.loadWithAjax();
            });
        } else if (data.loadType === "zoom") {
            (function() {
                var layers = self.filterByZoom(data.zoom);
                var counter = layers.length;
                layers.forEach(function(l) {
                    l.once("layerloaded", function() {
                        counter -= 1;
                        if (counter === 0) {
                            self.trigger("initiallayersloaded");
                            self.forEach(function(l2) {
                                if (!l2.get("loaded")) {
                                    l2.once("layerloaded", function() {
                                        var alllayersloaded = self
                                            .pluck("loaded")
                                            .every(function(value) {
                                                return value;
                                            });
                                        self.trigger("alllayersloaded");
                                    });
                                    l2.loadWithAjax();
                                }
                            });
                        }
                    });
                    l.loadWithAjax();
                });
            })();
        }
    },
});
