debug = getUrlParameter('debug');
var cache = [];
var config = readConfig("config.json");

function lightweight_cctray_monitor(){
    updateCache(config.pipelines, config.autoHiddenPrefix,  cache, false);
    setInterval(updateCache, 3000, config.pipelines, config.autoHiddenPrefix, cache, true);

    updatePresentation(config.successText, cache, debug);
    setInterval(updatePresentation, 5000, config.successText, cache, debug);

    setInterval(markUnreachablePipelines, 10000, cache);
}

lightweight_cctray_monitor();