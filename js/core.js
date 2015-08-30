debug = getUrlParameter('debug');
var cache = [];

function lightweight_cctray_monitor(){
    updateCache(config.pipelines, cache, false);
    setInterval(updateCache, 3000, config.pipelines, cache, true);

    updatePresentation(config.successText, cache, debug);
    setInterval(updatePresentation, 5000, config.successText, cache, debug);

    setInterval(markUnreachablePipelines, 10000, cache);
}