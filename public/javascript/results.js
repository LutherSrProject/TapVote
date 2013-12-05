/**
 * Created by isaac on 10/29/13.
 */

// GLOBAL PAGE VARIABLES //
pageTitle = "Results";


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
    titleDiv.text("Please enter a survey ID and click 'See Results'.");

    var idBox = $("<input id='survey-id' type='text' size=5 />");
    var button = $("<button type='button' class='pure-button pure-button-success pure-button-small'>See Results</button>");
    button.attr('onclick', 'redirectToSurvey()');

    var form = $("<form></form>");
    form.addClass("pure-form");
    form.append(idBox);
    form.append(button);

    var surveyDiv = $("#survey-questions");
    surveyDiv.append(form);
}

function redirectToSurvey() {
    window.location.href="/?p=results&survey=" + $("#survey-id").val();
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

    var el = $("<div></div>");
    el.text(results['title']);
    el.addClass('survey-title');
    titleDiv.append(el);

    var questionsDiv = $("#survey-questions");
    var questions = results['questions'];
    $.each(questions, function (index, question) {
        // create a div for each question in questions
        var questionDiv = $("<div></div>");
        questionDiv.attr('id', 'question-'+question['id']);
        questionDiv.attr('class', 'question rounded');

        var questionTitle = $("<div></div>");
        questionTitle.text(question['value']);
        questionTitle.addClass('question-title');
        questionDiv.append(questionTitle);

        var answers = question['answers'];
        $.each(answers, function (index, answer) {
            var answerDiv = $("<div></div>");
            answerDiv.attr('id', 'answer-'+answer['id']);
            answerDiv.attr('class', 'answer rounded');

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


