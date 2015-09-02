function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function readConfig(filename) {
    var c = null;
    $.ajax({
        dataType: "text",
        url: filename,
        async: false,
        success: function(data) {
            c = $.parseJSON(data);
        },
        error: function(data) {
            console.log("can't get config.json")
        }
    });
    return c;
}