// GLOBAL PAGE VARIABLES //
pageTitle = "Admin";


$(function getSurveyInfo() {
    var survey = $.QueryString['survey'];
    if (survey) {
        $.ajax({
            type:'GET',
            url: '/getSurveyInfo',
            data: {surveyId: survey},
            success: displaySurvey,
            error: displayAjaxError
        });
    } else {
        askForSurveyId();
    }
});

function askForSurveyId() {
    // This function is called when a survey Id isn't provided or when an invalid sId is given
    var titleDiv = $("#survey-title");
    titleDiv.text("Please enter a survey ID and click 'Edit Survey'.");

    var idBox = $("<input id='survey-id' class='no-wrap survey-id-input-box' type='text' size=5 />");
    var button = $("<button type='button' id='edit-survey-button'>Edit Survey</button>");
    button.addClass("pure-button pure-button-success pure-button-small");
    button.attr('onclick', 'redirectToSurvey()');

    var form = $("<form></form>");
    form.addClass("pure-form");
    form.attr("action", "javascript:$('#edit-survey-button').click();");
    form.append(idBox);
    form.append(button);

    var surveyDiv = $("#survey-questions");
    surveyDiv.append(form);
}

function redirectToSurvey() {
    window.location.href="/?p=admin&survey=" + $("#survey-id").val();
}

function displayAjaxError(error) {
    if (error.status == 404)
        askForSurveyId(); // 404 happens when an invalid survey ID is specified
    else
        console.log(error);
}

function displaySurvey(results) {
    var titleDiv = $("#survey-title");

    var el = $("<div></div>");
    el.text(results['title']);
    el.prepend("<i class='fa fa-pencil' onclick='editSurveyTitle();'></i>");
    el.addClass('survey-title');
    titleDiv.append(el);

    var questionsDiv = $("#survey-questions");
    questionsDiv.addClass("questions");

    var questions = results['questions'];
    $.each(questions, function (index, question) {
        // create a div for each question in questions
        var questionDiv = $("<div></div>");
        questionDiv.attr('data-question-id', question['id']);
        questionDiv.attr('class', 'question rounded');

        var deleteQuestionButton = $("<button></button>");
        deleteQuestionButton.attr("type", "button");
        deleteQuestionButton.addClass("remove-question-button pure-button pure-button-error");
        deleteQuestionButton.attr("onclick", "deleteQuestion(this);");
        deleteQuestionButton.html("<i class='fa fa-times fa-lg'></i>");
        questionDiv.append(deleteQuestionButton);


        var questionTitle = $("<div></div>");
        questionTitle.text(question['value']);
        questionTitle.addClass('question-title');
        questionDiv.append(questionTitle);

        var answers = question['answers'];
        $.each(answers, function (index, answer) {
            var answerDiv = $("<div></div>");
            answerDiv.attr('data-question-id', question['id']);
            answerDiv.attr('data-answer-id', answer['id']);
            answerDiv.attr('class', 'answer');

            var questionValue = $("<div></div>");
            questionValue.text(answer['value']);

            answerDiv.append(questionValue);

            questionDiv.append(answerDiv);
        });

        questionsDiv.append(questionDiv);
    });

    console.log(results);
}

function deleteQuestion(el) {
    var target = $(el);
    var questionDiv = target.parent();

    var questionId = questionDiv.attr('data-question-id');

    console.log(typeof parseInt(questionId));

    $.ajax({
        type:'POST',
        url: '/removeQuestion',
        data: JSON.stringify({questionId:parseInt(questionId)}),
        contentType: 'application/json',
        success: function(data) { questionDiv.remove() },
        error: displayAjaxError
    });
}

function editSurveyTitle() {
    console.log("Changing survey title is not implemented");
}


