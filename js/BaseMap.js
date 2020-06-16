function BaseMap(map) {
    L.control
        .scale({
            options: {
                position: "bottomleft",
                maxWidth: 100,
                metric: true,
                imperial: false,
                updateWhenIdle: false,
            },
        })
        .addTo(map);

    /*
    map.on('almost:click', function (e) {
        var popup = e.layer._popup;
        popup.setLatLng(e.latlng).openOn(map);
    });
    */
}
