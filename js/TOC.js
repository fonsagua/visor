function TOC(allLayers, overLays) {
    var addTo = function() {
        return L.control
            .groupedLayers({}, overLays, {
                collapsed: L.Browser.mobile,
                exclusiveGroups: ["Comunidades"],
            })
            .addTo(map);
    };

    var processLayer = function(layer) {
        var toc = layer.toc;
        var layerConfig = collection.get(layer.id);
        if (toc && layerConfig) {
            if (toc.label_prefix && typeof overLays[toc.group] === "string") {
                var toc_object = {};
                var label = toc.label_prefix + overLays[toc.group];
                toc_object[label] = layerConfig.get("layer");
                overLays[toc.group] = toc_object;
            } else {
                overLays[toc.group][toc.label] = layerConfig.get("layer");
            }
        }
    };

    var overLaysDefault = {
        Comunidades: {},
        Cartografía: {},
    };

    overLays = overLays || overLaysDefault;

    if (Array.isArray(allLayers)) {
        allLayers.forEach(function(layer) {
            processLayer(layer);
        });
    } else {
        Object.keys(allLayers).forEach(function(key) {
            var layer = allLayers[key];
            processLayer(layer);
        });
    }

    return addTo();
}
