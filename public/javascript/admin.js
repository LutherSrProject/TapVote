/**
 * Created by isaac on 10/29/13.
 */

// eventually this plugin should be included in a global fashion
// usage: $.QueryString["param"]
(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);


$(function getSurveyResults() {
    var survey = $.QueryString['survey'];
    $.get('/getSurveyResults', {surveyId: survey}, displaySurveyResults);
});

function displaySurveyResults(results) {
    console.log(results);
}

