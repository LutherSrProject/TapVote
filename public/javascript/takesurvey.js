// GLOBAL PAGE VARIABLES //
pageTitle = "Take Survey";

$(function getSurveyInfo() {
    var survey = $.QueryString['survey'];
    $.ajax({
        type:'GET',
        url: '/getSurveyInfo',
        data: {surveyId: survey},
        success: displaySurvey,
        error: displayAjaxError
    });
});

function displayAjaxError(error) {
    console.log(error.statusText);
    console.log(error.responseText);
    var titleDiv = $("#survey-title");
    titleDiv.text("Please enter a survey ID and click 'Take Survey'.");

    var surveyDiv = $("#survey-questions");
    var idBox = $("<input id='survey-id' type='text' size=5 />");
    var button = $("<button type='button'>Take Survey</button>");
    button.attr('onclick', 'redirectToSurvey()');

    surveyDiv.append(idBox);
    surveyDiv.append(button);
}

function redirectToSurvey() {
    window.location.href="/?p=takesurvey&survey=" + $("#survey-id").val();
}

function displaySurvey(results) {
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

            var answerOptionHtml = "<input type='radio'" + 
                                          "value='" + answer['id'] + "'" +
                                          "name='question-" + question['id'] + "-answer'>" +
                                        answer['value'] +
                                   "</input>";
            var answerValue = $(answerOptionHtml);

            answerDiv.append(answerValue);
            questionDiv.append(answerDiv);
        });
        questionsDiv.append(questionDiv);
    });

    $("#survey").append("<button onclick='submitSurvey();'>Vote!</button>");
    $("#survey").append("<br><br><div id='vote-status'></div>");
    console.log(results);
}

function submitSurvey() {
    $.each($(".question"), function (index, element) {
        var selected = $(element).find("input[type=radio]:checked");
        var answerId = selected.attr('value');

        var name = selected.attr('name');
        var questionId = name.substring(9, name.indexOf('answer')-1);

        answerId = parseInt(answerId);
        questionId = parseInt(questionId);

        var data = { questionId: questionId, answerId: answerId};

        $.ajax({
            type: 'POST',
            url: '/vote',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: showSubmitSuccess,
            error: showSubmitFailure
        });
    });
}

function showSubmitSuccess(results) {
    console.log(results);
    $("#vote-status").text("Success! Your vote has been recorded");
}

function showSubmitFailure(results) {
    console.log("Error submitting vote: ");
    console.log(results);
    $("#vote-status").text("Error! Your vote was not recorded. See the console for more information.");
}


