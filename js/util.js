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

// by Chris Geirman: http://codereview.stackexchange.com/questions/20571/find-all-factors-of-an-integer
function getFactors(integer){
  var factors = [],
  quotient = 0;

  for(var i = 1; i <= integer; i++){
    quotient = integer/i;

    if(quotient === Math.floor(quotient)){
      factors.push(i);
    }
  }
  return factors;
}

function getClosestFactors(integer) {
    var factors = getFactors(integer);
    var closest = null;
    factors.some(function(x){
        if (closest === null) {
            closest = [x, integer/x];
        }else{
            var y = integer/x;
            if (x>y) {
                return true;
            }
            var oldDiff = Math.abs(closest[0]-closest[1]);
            var newDiff = Math.abs(x-y);
            if (newDiff > oldDiff) {
                return true;
            }else{
                closest = [x, y];
            }
            return false;
        }
    });
    return closest;
}