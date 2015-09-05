function addStateDiv(debug, stepName, pipelineName, state, visible, guiURL, id) {
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
                stepName = stepName + "<br/>";//<br/>"
            }
            $('#lightweight-cctray-monitor').append(
                    '<div class="flex-child ' + stateCSS + '">' +
                    '<div class="inner-flex-child">' +
                    '<div class="inner-inner-flex-child" id="' + id + '">' +
                    '<a  style="white-space: nowrap;" href="' + guiURL + '" target="_blank">' +
                    stepName +
                    stateAsSpan +
                    pipelineName +
                    '</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
            );
        }
    }
}

function addSuccesTextDiv(successText) {
    $('#lightweight-cctray-monitor').append('<div class="flex-child healthy">' +
    '<div class="inner-flex-child">' +
    '<div class="inner-inner-flex-child" id="success-div">' +
    '<span>' +
    successText +
    '</span>' +
    '</div>' +
    '</div>' +
    '</div>');
    $('#success-div').textfill({innerTag: 'span', maxFontPixels: 0, minFontPixels: 2});
}

function addFailureTextDiv(failureText) {
    $('#lightweight-cctray-monitor').append('<div class="flex-child failed">' +
    '<div class="inner-flex-child">' +
    '<div class="inner-inner-flex-child" id="failure-div">' +
    '<span>' +
    failureText +
    '</span>' +
    '</div>' +
    '</div>' +
    '</div>');
    $('#failure-div').textfill({innerTag: 'span', maxFontPixels: 0, minFontPixels: 2});
}

(function($) {
    $.fn.textfill2 = function(maxFontSize) {
        maxFontSize = 0;
        return this.each(function(){
            var ourText = $("a", this),
                parent = ourText.parent(),
                maxHeight = parent.height(),
                maxWidth = parent.width(),
                fontSize = parseInt(ourText.css("fontSize"), 10),
                multiplier = maxWidth/ourText.width(),
                multiplier2 = maxHeight/ourText.height(),
                newSize = (fontSize*(Math.min(multiplier, multiplier2) -0.1));
            ourText.css("fontSize", newSize);
            ourText.css("lineHeight", ourText.height());
        });
    };
})(jQuery);

function updatePresentation(successText, cache, debug) {
    var cacheCopy = $.extend({}, cache);
    $('#lightweight-cctray-monitor').empty();
    var len = Object.keys(cacheCopy).length;
    if (len == 0) {
        addFailureTextDiv('Please add pipelines to config.js');
    } else {
        var i = 0;
        Object.keys(cacheCopy).forEach(function (key) {
            var cacheEntry = cacheCopy[key];
            addStateDiv(debug,
                    cacheEntry['stepName'],
                    cacheEntry['pipelineName'],
                    cacheEntry['state'],
                    cacheEntry['visible'],
                    cacheEntry['guiURL'],
                    i);
            i += 1;
        });
    }
    if ($('#lightweight-cctray-monitor div').length == 0) {
        addSuccesTextDiv(successText);
    }
    var countOfBoxes = 0;
    for(j = i; j >= 0; j--){
        var width = $('#' + j).width();
        var height = $('#' + j).height();
        if ((width != null) && (height != null)) {
            countOfBoxes += 1;
        }
    }
    if(countOfBoxes > 0) {
        var evenCountOfBoxes = countOfBoxes;
        if(countOfBoxes % 2 != 0 && countOfBoxes != 1){
            evenCountOfBoxes += 1;
        }
        var closestFactors = getClosestFactors(evenCountOfBoxes);
        if ($(window).width() > $(window).height()) {
            closestFactors.reverse();
        }
        $('.flex-child').css('min-width', Math.floor($(window).width()/closestFactors[0]/$(window).width()*100.0) - 2 + '%');
        $('.flex-child').css('max-width', Math.floor($(window).width()/closestFactors[0]/$(window).width()*100.0) - 2 + '%');
        $('.flex-child').css('min-height', Math.floor($(window).width()/closestFactors[1]/$(window).width()*100.0) - 2 + '%');
        $('.flex-child').css('max-height', Math.floor($(window).width()/closestFactors[1]/$(window).width()*100.0) - 2 + '%');
        if(countOfBoxes % 2 != 0 && countOfBoxes != 1){
            $('.flex-child').slice(-closestFactors[0]+1).css('min-width', Math.floor($(window).width()/(closestFactors[0]-1)/$(window).width()*100.0) - 2 + '%');
            $('.flex-child').slice(-closestFactors[0]+1).css('max-width', Math.floor($(window).width()/(closestFactors[0]-1)/$(window).width()*100.0) - 2 + '%');
        }
    }
    for(j = i; j >= 0; j--){
        var width = $('#' + j).width();
        var height = $('#' + j).height();
        if ((width != null) && (height != null)) {
            $('#' + j).textfill({innerTag: 'a', maxFontPixels: 0, minFontPixels: 2, changeLineHeight: true});
        }
    }
}
