/**
 * Created by isaac on 10/29/13.
 */

$(function getSurveyInfo() {
    var survey = $.QueryString['survey'];
    $.ajax({
        type:'GET',
        url: '/getSurveyInfo',
        data: {surveyId: survey},
        success: displaySurveyInfo,
        error: displayAjaxError
    });
});

function getSurveyResults() {
    var survey = $.QueryString['survey'];
    $.ajax({
        type:'GET',
        url: '/getSurveyResults',
        data: {surveyId: survey},
        success: displaySurveyResults,
        error: displayAjaxError
    });
}

function displayAjaxError(error) {
    console.log(error.statusText);
    console.log(error.responseText);
    var titleDiv = $("#survey-title");
    titleDiv.text("Error getting survey or results. Did you specify a non-existent survey id?");
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


