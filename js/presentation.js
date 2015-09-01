function addStateDiv(debug, stepName, pipelineName, state, visible, guiURL) {
    if (visible || debug) {
        if (!visible) {
            stateCSS = 'unmonitored-step'
        } else if (state == 'sick') {
            stateCSS = 'failed';
        } else if (state == 'healthy-building') {
            stateCSS = 'running-after-healthy';
        } else if (state == 'sick-building') {
            stateCSS = 'running-after-failed';
        } else if (state == 'healthy') {
            stateCSS = 'healthy';
        } else {
            stateCSS = 'unknown'
        }
        if (debug || ((state != 'healthy') && (state != 'unknown'))) {
            var stateAsSpan = '';
            if (debug) {
                stateAsSpan = state + '<br/>';
            }
            if (stepName != "") {
                stepName = stepName + "<br/><br/>"
            }
            $('#lightweight-cctray-monitor').append(
                    '<div class="flex-child ' + stateCSS + '">' +
                    '<a href="' + guiURL + '" target="_blank">' +
                    stepName +
                    stateAsSpan +
                    pipelineName +
                    '</a>' +
                    '</div>'
            );
        }
    }
}

function addSuccesTextDiv(successText) {
    $('#lightweight-cctray-monitor').append('<div class="flex-child healthy">' +
    '<span>' +
    successText +
    '</span>' +
    '</div>');
}

function addFailureTextDiv(failureText) {
    $('#lightweight-cctray-monitor').append('<div class="flex-child failed">' +
    '<span>' +
    failureText +
    '</span>' +
    '</div>');
}

function updatePresentation(successText, cache, debug) {
    var cacheCopy = $.extend({}, cache);
    $('#lightweight-cctray-monitor').empty();
    var len = Object.keys(cacheCopy).length;
    if (len == 0) {
        addFailureTextDiv('Please add pipelines to config.js');
    } else {
        Object.keys(cacheCopy).forEach(function (key) {
            var cacheEntry = cacheCopy[key];
            addStateDiv(debug,
                    cacheEntry['stepName'],
                    cacheEntry['pipelineName'],
                    cacheEntry['state'],
                    cacheEntry['visible'],
                    cacheEntry['guiURL'])
            ;
        });
    }
    if ($('#lightweight-cctray-monitor div').length == 0) {
        addSuccesTextDiv(successText);
    }
}