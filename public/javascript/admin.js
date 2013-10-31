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


$(function getSurveyInfo() {
    var survey = $.QueryString['survey'];
    //$.get('/getSurveyInfo', {surveyId: survey}, displaySurveyInfo);
    $.ajax({
        type:'GET',
        url: '/getSurveyInfo',
        data: {surveyId: survey},
        success: displaySurveyInfo,
        error: displayAjaxError
    });
});

function displayAjaxError(error) {
    console.log(error.statusText);
    console.log(error.responseText);
}

function getSurveyResults() {
    var survey = $.QueryString['survey'];
    $.get('/getSurveyResults', {surveyId: survey}, displaySurveyResults);
}

function displaySurveyResults(results) {
    $.each(results, function (key, value) {
        var elementId = '#answer-' + key;
        var resultSpan = $("<span></span>");
        resultSpan.text(value);

        $(elementId).append(resultSpan);
    });
    console.log(results);
}

function displaySurveyInfo(results) {
    var titleDiv = $("#survey-title");

    if (results.length = 0) {
        titleDiv.text("Unknown survey Id");
        return;
    }


    var el = $("<h2></h2>");
    el.text(results['title']);
    titleDiv.append(el);

    var questionsDiv = $("#survey-questions");
    var questions = results['questions'];
    $.each(questions, function (index, question) {
        // create a div for each question in questions
        var questionDiv = $("<div></div>");
        questionDiv.attr('id', 'question-'+question['id']);
        questionDiv.attr('class', 'question');

        var questionTitle = $("<div></div>");
        questionTitle.text(question['value']);
        questionDiv.append(questionTitle);

        var answers = question['answers'];
        $.each(answers, function (index, answer) {
            var answerDiv = $("<div></div>");
            answerDiv.attr('id', 'answer-'+answer['id']);
            answerDiv.attr('class', 'answer');

            var questionValue = $("<div></div>");
            questionValue.text(answer['value']);

            answerDiv.append(questionValue);

            questionDiv.append(answerDiv);
        });

        questionsDiv.append(questionDiv);
    });

    console.log(results);
    getSurveyResults();
}

