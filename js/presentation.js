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
                stateAsSpan = '<br/><span style="font-size: x-small;">' + state + '</span>';
            }
            if (stepName != "") {
                stepName = stepName + "<br/>"
            }
            $('#lightweight-cctray-monitor').append(
                    '<div class="flex-child ' + stateCSS + '">' +
                    '<div class="inner-flex-div">' +
                    '<p class="inner-flex-p">' +
                    '<a href="' + guiURL + '" target="_blank">' +
                    stepName +
                    '<span style="font-size: smaller;">' + pipelineName + '</span>' +
                    stateAsSpan +
                    '</a>' +
                    '</p>' +
                    '</div>' +
                    '</div>'
            );
        }
    }
}

function addSuccesTextDiv(successText) {
    $('#lightweight-cctray-monitor').append('<div id="success-div" class="flex-child healthy">' +
    '<div class="inner-flex-div">' +
    '<p class="inner-flex-p">'
    + successText +
    '</p></div></div>');
}

function addFailureTextDiv(failureText) {
    $('#lightweight-cctray-monitor').append('<div id="success-div" class="flex-child failed">' +
    '<div class="inner-flex-div">' +
    '<p class="inner-flex-p">'
    + failureText +
    '</p></div></div>');
}

function updatePresentation(successText, cache, debug) {
    var cacheCopy = $.extend({}, cache);
    $('#lightweight-cctray-monitor').empty();
    var len = Object.keys(cacheCopy).length;
    if (len == 0) {
        addFailureTextDiv('no states in cache');
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