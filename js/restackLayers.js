function restackOneLayer(event) {
    var zoom = map.getZoom();

    collection.forEach(function(layerConfig) {
        var layer = layerConfig.get("layer");
        if (L.stamp(layer) == event.id) {
            layerConfig.set("usersControlsVisibility", true);
            if (event.visible) {
                feature_group.addLayer(layer);
            } else {
                feature_group.removeLayer(layer);
            }
        }
    });

    collection.forEach(function(layerConfig) {
        var layer = layerConfig.get("layer");
        if (map.hasLayer(layer)) {
            layer.bringToFront();
        }
    });
}

function restackLayers() {
    /*
  Una solución a explorar sería crear un container para cada capa
  y aplicar .hide() / .show() al container
  */
    var zoom = map.getZoom();
    collection.forEach(function(layerConfig) {
        var layer = layerConfig.get("layer");
        //TODO if layer in layer2set
        // layers_group.addLayer(layer);
        if (layerConfig.isVisible(zoom, feature_group, layer)) {
            // Si ya existe no hace nada
            feature_group.addLayer(layer);
            // Como collection está ordenado de capa superior en el TOC a capa
            // inferior (primera en ser renderizada), bringToBack debería
            // ejecutarse en realidad pocas veces.
            // layer.bringToBack();
            layer.bringToFront();
        } else {
            feature_group.removeLayer(layer);
        }
    });

    // feature_group.bringToBack();
}
