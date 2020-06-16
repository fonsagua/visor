var map = L.map("map", {
    zoomControl: true,
    maxZoom: 19,
    minZoom: 1,
    almostOnMouseMove: false,
});
map.setView([13.361562755530372, -87.4127197265625], 10);

var hash = new L.Hash(map);

var feature_group = new L.featureGroup([]);

var basemap0 = L.tileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
});

basemap0.addTo(map);

var collection = new Backbone.SIXHIARA.LayerConfigCollection();

var allLayers = undefined;
$.getJSON("config-layers.json", function(data) {
    allLayers = data;
    for (var i = allLayers.length - 1; i >= 0; i--) {
        allLayers[i].initialOrder = i;
        // Un workaround. Muchas de las operaciones de leaflet se hacen
        // teniendo en cuenta el orden fijando por _leaflet_id que se genera a través
        // de L.stamp como un serial cuando se hace el addLayer. De este modo forzamos
        // el orden de las capas de la forma que nos interesa a nosotros
        var tmpLayerConfig = collection.add(allLayers[i]);
        L.stamp(tmpLayerConfig.get("layer"));
    }
    collection.load({
        loadType: "zoom",
        zoom: map.getZoom(),
    });
    var toc = TOC(allLayers);
    //TODO handle json parse error
    //raster_js(toc);
});

collection.on("initiallayersloaded", function() {
    feature_group.addTo(map);
    restackLayers();
    document.getElementsByName("leaflet-exclusive-group-layer-0")[0].click();
    map.on("zoomend", function(e) {
        restackLayers();
    });
});

BaseMap(map);
elementSearcher();

var sidebar = L.control.sidebar("helpsidebar", {
    position: "left",
    closeButton: false,
});

map.addControl(sidebar);

// var helpButton = L.control({position: "topleft"});
// helpButton.onAdd = function(map) {
//     var link = L.DomUtil.create("a", "helpButton");
//     link.href = "#";
//     L.DomEvent.on(link, "click", L.DomEvent.stopPropagation)
//         .on(link, "click", L.DomEvent.preventDefault)
//         .on(link, "click", function() {
//             sidebar.toggle();
//             if (sidebar.isVisible()) {
//                 localStorage.clear();
//             } else {
//                 localStorage.setItem("hideHelpSidebar", "true");
//             }
//         });
//     link.innerHTML = "?";
//     return link;
// };
// helpButton.addTo(map);

document
    .getElementsByClassName("sidebarIconToggle")[0]
    .addEventListener("click", function(e) {
        // e.stopPropagation();
        // e.preventDefault();
        sidebar.toggle();
        if (sidebar.isVisible()) {
            localStorage.clear();
        } else {
            localStorage.setItem("hideHelpSidebar", "true");
        }
    });

if (!localStorage.getItem("hideHelpSidebar")) {
    setTimeout(function() {
        sidebar.show();
        document.getElementById("openSidebarMenu").checked = true;
    }, 500);
} else {
    document.getElementById("openSidebarMenu").checked = false;
}
