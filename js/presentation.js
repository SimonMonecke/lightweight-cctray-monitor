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
                '<b>' + pipelineName + '</b>' +
                '</a>' +
                '</div>' +
                '</div>' +
                '</div>'
            );
        }
    }
}

function addSuccessTextDiv(successText) {
    var successTextWithDefault = successText || ":D";
    $('#lightweight-cctray-monitor').append('<div class="flex-child healthy" style="height: calc(100% - 20px);">' +
        '<div class="inner-flex-child">' +
        '<div class="inner-inner-flex-child" id="success-div">' +
        '<span>' +
        successTextWithDefault +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>');
    $('#success-div').textfill({innerTag: 'span', maxFontPixels: 0, minFontPixels: 2});
}

function addFailureTextDiv(failureText) {
    $('#lightweight-cctray-monitor').append('<div class="flex-child failed style="height: calc(100% - 20px);">' +
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

(function ($) {
    $.fn.textfill2 = function (maxFontSize) {
        maxFontSize = 0;
        return this.each(function () {
            var ourText = $("a", this),
                parent = ourText.parent(),
                maxHeight = parent.height(),
                maxWidth = parent.width(),
                fontSize = parseInt(ourText.css("fontSize"), 10),
                multiplier = maxWidth / ourText.width(),
                multiplier2 = maxHeight / ourText.height(),
                newSize = (fontSize * (Math.min(multiplier, multiplier2) - 0.1));
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
        addSuccessTextDiv('Loading...');
    } else {
        var i = 0;
        $.each(cacheCopy, function (pipelineName, pipelineEntry) {
            $.each(pipelineEntry, function (index, step) {
                addStateDiv(debug,
                    step['stepName'],
                    step['pipelineName'],
                    step['state'],
                    step['visible'],
                    step['guiURL'],
                    i);
                i += 1;
            });
        });
    }
    if ($('#lightweight-cctray-monitor div').length == 0) {
        addSuccessTextDiv(successText);
    }
    var countOfBoxes = 0;
    for (j = i; j >= 0; j--) {
        var width = $('#' + j).width();
        var height = $('#' + j).height();
        if ((width != null) && (height != null)) {
            countOfBoxes += 1;
        }
    }
    if (!debug) {
        if (countOfBoxes > 0) {
            var evenCountOfBoxes = countOfBoxes;
            if (countOfBoxes % 2 != 0 && countOfBoxes != 1) {
                evenCountOfBoxes += 1;
            }
            var closestFactors = getClosestFactors(evenCountOfBoxes);
            if ($(window).width() > $(window).height()) {
                closestFactors.reverse();
            }
            $('.flex-child').css('width', 'calc(' + Math.floor($(window).width() / closestFactors[0] / $(window).width() * 100.0) + '% - 4px)');
            $('.flex-child').css('height', 'calc(' + Math.floor($(window).width() / closestFactors[1] / $(window).width() * 100.0) + '% - 4px)');
            if (countOfBoxes % 2 != 0 && countOfBoxes != 1) {
                $('.flex-child').slice(-closestFactors[0] + 1).css('width', 'calc(' + Math.floor($(window).width() / (closestFactors[0] - 1) / $(window).width() * 100.0) + '% - 4px)');
            }
        }
        for (j = i; j >= 0; j--) {
            var width = $('#' + j).width();
            var height = $('#' + j).height();
            if ((width != null) && (height != null)) {
                $('#' + j).textfill({innerTag: 'a', maxFontPixels: 0, minFontPixels: 2, changeLineHeight: true});
            }
        }
    } else {
        $('body').css('overflow', 'scroll');
    }
}
