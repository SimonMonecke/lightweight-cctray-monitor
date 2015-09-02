function transformState(acitivity, lastBuildStatus) {
    var state = '';
    if (lastBuildStatus == 'Success') {
        state = 'healthy';
    } else if (lastBuildStatus == 'Failure') {
        state = 'sick';
    } else if (lastBuildStatus == 'Unknown') {
        state = 'unknown';
    }
    if ((state == 'unknown') && acitivity == "Building") {
        state = 'healthy-building';
    } else if ((state != 'unknown') && acitivity == "Building") {
        state = state + '-building';
    }
    return state;
}

function updateCache(pipelines, cache, asynCall) {
    pipelines.forEach(function (pipeline) {
        var invisibleSteps = pipeline['invisibleSteps'];
        var cctrayUrl = pipeline['cctrayUrl'];
        var guiURL = pipeline['guiUrl'];
        $.ajax({
                    type: 'GET',
                    url: cctrayUrl,
                    success: function (response) {
                        $(response).find('Project').each(function (project) {
                            var name = $(this).attr('name');
                            var activity = $(this).attr('activity');
                            var lastBuildStatus = $(this).attr('lastBuildStatus');
                            var newState = transformState(activity, lastBuildStatus);
                            var cacheEntry = [];
                            var keyName = pipeline['displayName'] + '-' + name;
                            cacheEntry['stepName'] = name;
                            cacheEntry['pipelineName'] = pipeline['displayName'];
                            cacheEntry['state'] = newState;
                            cacheEntry['visible'] = ($.inArray(name, invisibleSteps) == -1);
                            cacheEntry['guiURL'] = guiURL;
                            cacheEntry['timestamp'] = Math.floor(Date.now() / 1000);
                            cache[keyName] = cacheEntry;
                        });
                    },
                    error: function (response) {
                        var cacheEntry = [];
                        cacheEntry['stepName'] = '';
                        cacheEntry['pipelineName'] = pipeline['displayName'];
                        cacheEntry['state'] = 'sick';
                        cacheEntry['visible'] = true;
                        cacheEntry['timestamp'] = Math.floor(Date.now() / 1000);
                        cacheEntry['guiURL'] = guiURL;
                        cache[pipeline['displayName']] = cacheEntry;
                    }
                    ,
                    dataType: 'xml',
                    crossDomain: true,
                    async: asynCall
                }
        )
        ;
    });
}

function markUnreachablePipelines(cache) {
    now = Math.floor(Date.now() / 1000);

    Object.keys(cache).forEach(function (key) {
        var cacheEntry = cache[key];
        if (cacheEntry['timestamp'] < now - 10) {
            delete cache[key];
        }
    });
}