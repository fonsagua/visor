var doStyleInvisibleMarker = function() {
    return {
        radius: 2.0,
        fillColor: "#000000",
        color: "#000000",
        weight: 2.0,
        opacity: 0,
        fillOpacity: 0,
    };
};

function doStyleMicrocuencas(feature) {
    return {
        weight: 1,
        fillColor: "#fff",
        color: "#7ba86e",
        opacity: 1,
        fillOpacity: 0,
    };
}

var doPointToLayerMicrocuencas_Points = function(feature, latlng) {
    return L.circleMarker(latlng, doStyleInvisibleMarker()).bindLabel(
        feature.properties.nombre,
        {
            noHide: true,
            offset: [-15, -10],
            className: "label-microcuencas",
            opacity: 1,
            zoomAnimation: true,
            // direction: 'auto',
            clickable: false,
        }
    );
};

var onEachFeatureMicrocuencas = function(feature, layer) {
    layer.on("layeradd", function() {
        var center = layer.getBounds().getCenter();
        let label = L.circleMarker(center, doStyleInvisibleMarker())
            .bindLabel(feature.properties.nombre, {
                noHide: true,
                offset: [-15, -10],
                className: "label-microcuencas",
                opacity: 1,
                zoomAnimation: true,
                // direction: 'auto',
                clickable: false,
            })
            .addTo(layer._map);
    });
};

function doStyleMunicipios(feature) {
    var ret = {
        weight: 4.0,
        fill: true,
        fillColor: "#000000",
        color: "rgba(35,35,35,0.0)",
        dashArray: "",
        lineCap: "butt",
        lineJoin: "miter",
        opacity: 1,
        fillOpacity: 0.4,
        clickable: false,
    };

    switch (feature.properties.nombre) {
        case "Amapala":
            ret.fillColor = "#fdba9b";
            break;
        case "El Triunfo":
            ret.fillColor = "#fcb7ac";
            break;
        case "Goascoran":
            ret.fillColor = "#fba9b6";
            break;
        case "Marcovia":
            ret.fillColor = "#fba9b6";
            break;
        case "Nacaome":
            ret.fillColor = "#e9529b";
            break;
        case "Namasigue":
            ret.fillColor = "#cc268d";
            break;
        case "San Lorenzo":
            ret.fillColor = "#a50f82";
            break;
        default:
            throw new Error("Municipio no reconocido");
    }

    return ret;
}

var doPointToLayerMunicipios_Points = function(feature, latlng) {
    return L.circleMarker(latlng, doStyleInvisibleMarker()).bindLabel(
        feature.properties.nombre,
        {
            noHide: true,
            offset: [-15, -10],
            className: "label-municipios",
            opacity: 1,
            zoomAnimation: true,
            // direction: 'auto',
            clickable: false,
        }
    );
};

function doPointToLayerComunidadesSan(feature, latlng) {
    return L.circleMarker(latlng, doStyleComunidadesSan(feature));
}

function doStyleComunidadesSan(feature) {
    var value = (feature.properties.san_total * 100) / feature.properties.viv_total;
    if (feature.properties.san_total == null) {
        return {
            radius: 2.8,
            fillColor: "#68676d",
            color: "#fff",
            weight: 0,
            opacity: 0,
            fillOpacity: 1,
        };
    }
    if (value >= 70) {
        return {
            radius: 3.6,
            fillColor: "#ff6600",
            color: "#e31a1c",
            weight: 1,
            opacity: 1,
            fillOpacity: 1,
        };
    }
    if (value < 70 && value > 30) {
        return {
            radius: 3.6,
            fillColor: "#f7c792",
            color: "#f88a02",
            weight: 1,
            opacity: 1,
            fillOpacity: 1,
        };
    }
    if (value <= 30) {
        return {
            radius: 3.6,
            fillColor: "#f9a423",
            color: "#ff7f00",
            weight: 1,
            opacity: 1,
            fillOpacity: 1,
        };
    }
}

function doPointToLayerComunidadesAbast(feature, latlng) {
    return L.circleMarker(latlng, doStyleComunidadesAbast(feature));
}

function doStyleComunidadesAbast(feature) {
    var value = (feature.properties.abas_total * 100) / feature.properties.fam_total;
    if (feature.properties.abas_total == null) {
        return {
            radius: 2.8,
            fillColor: "#68676d",
            color: "#fff",
            weight: 0,
            opacity: 0,
            fillOpacity: 1,
        };
    }
    if (value >= 80) {
        return {
            radius: 3.6,
            fillColor: "#336ff0",
            color: "#1e428f",
            weight: 1,
            opacity: 1,
            fillOpacity: 1,
        };
    }
    if (value < 80 && value > 50) {
        return {
            radius: 3.6,
            fillColor: "#a7bef0",
            color: "#336ff0",
            weight: 1,
            opacity: 1,
            fillOpacity: 1,
        };
    }
    if (value <= 50) {
        return {
            radius: 3.6,
            fillColor: "#e7ebf3",
            color: "#a7bef0",
            weight: 1,
            opacity: 1,
            fillOpacity: 1,
        };
    }
}

var doPointToLayerComunidades_Points = function(feature, latlng) {
    return L.circleMarker(latlng, doStyleInvisibleMarker()).bindLabel(
        feature.properties.nombre,
        {
            noHide: true,
            offset: [1, -17],
            className: "label-comunidades",
            opacity: 1,
            zoomAnimation: true,
            // direction: 'auto',
            clickable: false,
        }
    );
};
