var popupoptions = {
    minWidth: 275,
    maxWidth: 375,
};

function removeAccents(str) {
    // https://gist.github.com/alisterlf/3490957
    var accents = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
    var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    str = str.split("");
    var strLen = str.length;
    var i, x;
    for (i = 0; i < strLen; i++) {
        if ((x = accents.indexOf(str[i])) != -1) {
            str[i] = accentsOut[x];
        }
    }
    return str.join("");
}

function normalizeFileName(text) {
    text = removeAccents(text);
    return text
        .replace(/\s*\/\s*/, "_")
        .replace(/\s*\-\s*/, "_")
        .replace("´", "")
        .replace(" ", "_")
        .toUpperCase();
}

function pop_getMyValue(feature, short_name, long_name) {
    var value =
        feature.properties[short_name] !== null
            ? Autolinker.link(String(feature.properties[short_name]))
            : "-";
    value = value === 0 || value === "0" ? "-" : value;
    var str = '<tr><th scope="row">' + long_name + ":</th><td> " + value + "</td></tr>";
    return str;
}

function pop_appendImageLiteral(filename, folder) {
    return (
        '<div style="text-align:center"><img style="margin:10px auto;" width="250" height="200" src="media/' +
        folder +
        "/" +
        filename +
        '" onerror="removeImage(this)"></div>'
    );
}

function pop_appendImage(feature, code, folder) {
    var str_code = feature.properties[code];
    if (!str_code) {
        return "";
    }
    var filename = str_code.replace(/\s+|-/, "_");
    filename += ".jpg";
    return pop_appendImageLiteral(filename, folder);
}

function pop_appendImageEnlarge(feature, code, folder, extension, tamanho) {
    var str_code = feature.properties[code];
    if (!str_code) {
        return "";
    }
    extension = extension || ".png";
    tamanho = tamanho || ' width="350" height="152" ';
    var filename = normalizeFileName(str_code);
    return (
        '<div style="text-align:center"><a href="media/' +
        folder +
        "/" +
        filename +
        extension +
        '" target="_blank"> <img style="text-align: center; margin:10px auto;" onerror="removeImage(this)" title="Clique para ampliar"' +
        tamanho +
        'src="media/' +
        folder +
        "/thumb_" +
        filename +
        extension +
        '"></a></div>'
    );
}

function removeImage(img) {
    img.remove();
}

function pop_Comunidades(feature, layer) {
    var popupContent =
        "<table>" +
        pop_getMyValue(feature, "codigo", "Código") +
        pop_getMyValue(feature, "nombre", "Nombre") +
        pop_getMyValue(feature, "n_depart", "Departamento") +
        pop_getMyValue(feature, "n_muni", "Municipio") +
        pop_getMyValue(feature, "n_aldea", "Aldea") +
        pop_getMyValue(feature, "pob_total", "Población") +
        pop_getMyValue(feature, "categoria", "Categoria") +
        pop_getMyValue(feature, "fam_total", "Número de familias") +
        pop_getMyValue(feature, "viv_total", "Número de viviendas") +
        pop_getMyValue(feature, "ano_pgirh", "Año PGIRH") +
        pop_getMyValue(feature, "san_total", "Viviendas con Saneamiento") +
        pop_getMyValue(feature, "abas_total", "Familias con Abastecimiento") +
        pop_getMyValue(feature, "junta_agua", "¿Hay junta de agua?");
    popupContent += "</table>";
    layer.bindPopup(popupContent, popupoptions);
}
