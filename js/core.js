debug = getUrlParameter('debug');
var cache = [];
var config = readConfig("config.json");

function lightweight_cctray_monitor(){
    updatePresentation(config.successText, cache, debug);
    setInterval(updatePresentation, 5000, config.successText, cache, debug);

    var autoHiddenRegexCompiled = config.autoHiddenRegex !== undefined && config.autoHiddenRegex !== "" ? new RegExp(config.autoHiddenRegex) : null;
    updateCache(config.pipelines, autoHiddenRegexCompiled, config.defaultHiddenSteps, cache, true);
    setInterval(updateCache, 3000, config.pipelines, autoHiddenRegexCompiled, config.defaultHiddenSteps, cache, true);
}

window.onload = lightweight_cctray_monitor;