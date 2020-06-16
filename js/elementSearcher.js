function elementSearcher() {
    var featuresLayer = new L.layerGroup();

    // add searchable layers to set os layers to be searched
    // and initialize searchBy field
    collection.on("alllayersloaded", function() {
        collection.forEach(function(lc) {
            var layer = lc.get("layer");
            var sby = lc.get("searchByFields");
            if (sby) {
                featuresLayer.addLayer(layer);
                layer.eachLayer(function(l) {
                    var searchBy = sby
                        .map(function(k) {
                            return l.feature.properties[k];
                        })
                        .join(" | ");
                    l.feature.properties["searchBy"] = searchBy;
                    var searchByLabel = lc.get("searchByLabel");
                    if (typeof searchByLabel === "object") {
                        /*
                    Hack. How searchByLabel can be configured must be improved.
                    For now, if it's an object the keys of this config object are
                    used as the keys of the feature properties that must be used
                    for build the label
                    */
                        searchByLabel = Object.keys(searchByLabel)
                            .map(function(k) {
                                return l.feature.properties[k];
                            })
                            .join(" | ");
                    }
                    l.feature.properties["layerType"] = searchByLabel;
                });
            }
        });
    });

    //var featuresLayer = layers_to_search_group;
    var searchControl = new L.Control.Search({
        layer: featuresLayer,
        collapsed: false,
        initial: false,
        // position: 'topcenter', // handled with css
        tooltipLimit: 10,
        textErr: "Elemento no encontrado", //error message
        textCancel: "Cancelar", //title in cancel button
        textPlaceholder: "Buscar ...", //placeholder value

        propertyName: "searchBy",

        buildTip: function(text, val) {
            layerType = val.layer.feature.properties.layerType;
            var n = text.indexOf("|");
            if (n == -1) {
                n = text.length;
            }
            return (
                '<a href="#"> <span class="resultTitle">' +
                text.substring(0, n) +
                '</span> <span class="resultClass">' +
                layerType +
                "</span></a>"
            );
        },

        marker: false,

        moveToLocation: function(latlng, title, map) {
            //map.fitBounds( latlng.layer.getBounds() );
            var zoom = 15; //TODO use constant or parameter instead literal
            if (latlng.layer.getBounds) {
                var newZoom = map.getBoundsZoom(latlng.layer.getBounds());
                if (newZoom < zoom) {
                    zoom = newZoom;
                }
            }
            map.setView(latlng, zoom); // access the zoom
        },
    });

    searchControl.on("search:locationfound", function(e) {
        if (e.layer._popup) e.layer.openPopup();
    });

    map.addControl(searchControl); //inizialize search control
    map.removeLayer(featuresLayer);
}
