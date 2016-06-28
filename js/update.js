function transformState(activity, lastBuildStatus) {
    var state = '';
    if (lastBuildStatus == 'Success') {
        state = 'healthy';
    } else if (lastBuildStatus == 'Failure') {
        state = 'sick';
    } else if (activity == 'Sleeping') {
        state = 'waiting';
    } else if (lastBuildStatus == 'Unknown') {
        state = 'unknown';
    }
    if ((state == 'unknown') && activity == "Building") {
        state = 'healthy-building';
    } else if ((state != 'unknown') && activity == "Building") {
        state = state + '-building';
    }
    return state;
}

function updateCache(pipelines, hiddenPrefix, defautHiddenSteps, cache, asynCall) {
    $.each(pipelines, function(pipelineName, pipeline) {
        var hiddenSteps = pipeline['hiddenSteps'];
        var cctrayUrl = pipeline['cctrayUrl'];
        var guiURL = pipeline['guiUrl'];
        var guiURL = pipeline['visibleWaitingSteps'];
        $.ajax({
                    type: 'GET',
                    url: cctrayUrl,
                    success: function (response) {
                        var newProjectCache = new Array();
                        $(response).find('Project').each(function (project) {
                            var name = $(this).attr('name');
                            var activity = $(this).attr('activity');
                            var lastBuildStatus = $(this).attr('lastBuildStatus');
                            var newState = transformState(activity, lastBuildStatus);
                            var cacheEntry = [];
                            //var keyName = pipeline['displayName'] + '-' + name;
                            cacheEntry['stepName'] = name;
                            cacheEntry['pipelineName'] = pipelineName;
                            cacheEntry['state'] = newState;
                            cacheEntry['visible'] = ($.inArray(name, hiddenSteps) == -1) &&
                                                    ($.inArray(name, defautHiddenSteps) == -1) &&
                                                    !(name.startsWith(hiddenPrefix)) &&
                                                    ($.inArray(name, visibleWaitingSteps) != -1);
                            cacheEntry['guiURL'] = guiURL;
                            newProjectCache.push(cacheEntry);
                        });
                        cache[pipelineName] = newProjectCache;
                    },
                    error: function (response) {
                        var newProjectCache = new Array();
                        var cacheEntry = [];
                        cacheEntry['stepName'] = '';
                        cacheEntry['pipelineName'] = pipelineName;
                        cacheEntry['state'] = 'sick';
                        cacheEntry['visible'] = true;
                        cacheEntry['guiURL'] = guiURL;
                        newProjectCache.push(cacheEntry);
                        cache[pipelineName] = newProjectCache;
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