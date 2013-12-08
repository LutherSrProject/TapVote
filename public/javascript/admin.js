// GLOBAL PAGE VARIABLES //
pageTitle = "Admin";


$(getSurveyInfo);

function getSurveyInfo() {
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
}

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
    titleDiv.html(el);

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

    var createQuestionButton ='<button type="button"' +
                              '        class="pure-button pure-button-success pure-button-small"' +
                              '        data-dropdown="#question-type-dropdown">Create Question' +
                              '</button>';
    $("#create-question-button-container").html(createQuestionButton);
}

/* create the HTML for a new question form - doesn't actually submit anything to the server */
function createQuestion(type) {
    var questionHtml = '<div class="question rounded ' + type + '" data-question-type="'+type+'">' +
        '  <button type="button" class="remove-question-button pure-button pure-button-error" onclick="removeQuestionElement(this);"><i class="fa fa-times fa-lg"></i></button> ' +
        '  <label for="question-text">Question</label><input type="text" class="question-text" />' +
        '  <div class="answers">' +
        '    <div class="answer">' +
        '     <label for="answer-text">Answer Choice</label><input type="text" class="answer-text no-wrap" />' +
        '     <button type="button" class="remove-answer-button pure-button pure-button-error" onclick="removeAnswerElement(this);"><i class="fa fa-times"></i></button><br>' +
        '    </div>' +
        '  </div>' +
        '  <button type="button" class="add-answer-button pure-button pure-button-success pure-button-small" style="vertical-align:-7px;" onclick="addAnswerElement(this);"><i class="fa fa-plus"></i></button>' +
        '  <button type="button" class="pure-button pure-button-primary pure-button-small" onclick="saveQuestion(this);">Save Question</button>' +
        '</div>';

    $(".questions").append(questionHtml);
}

/* send a newly created question to the server */
function saveQuestion(el) {
    var target = $(el);
    var questionDiv = target.parent();

    var answerList = [];
    var questionText = questionDiv.find(".question-text").val();
    var questionType = questionDiv.attr("data-question-type");

    var answers = questionDiv.find(".answer-text");
    $.each(answers, function (idx, v) {
        var answerText = $(v).val();
        answerList.push(answerText);
    });

    var question = {"question":questionText, "type":questionType, "answers":answerList};
    var surveyId = parseInt($.QueryString['survey']);
    var data = JSON.stringify({"surveyId":surveyId, "questions":[question]});

    $.ajax({
        type: "POST",
        url: "/addQuestions",
        data: data,
        contentType: 'application/json',
        success: function(data) {
            updateNewQuestion(questionDiv, data);
        },
        error: function(data) { console.log(data); }
    })
}

/* update the display of the new question to reflect that it has been stored on the server */
function updateNewQuestion(questionDiv, serverResponse) {
    // re-request the survey info and display it
    var questionsDiv = $("#survey-questions");
    questionsDiv.empty();

    getSurveyInfo();
}

/* remove the HTML for a new (unsubmitted) question */
function removeQuestionElement(el) {
    var target = $(el);
    var questionDiv = target.parent();
    questionDiv.remove();
}

/* delete the question from the server-side */
function deleteQuestion(el) {
    var target = $(el);
    var questionDiv = target.parent();
    var questionId = questionDiv.attr('data-question-id');

    $.ajax({
        type:'POST',
        url: '/removeQuestion',
        data: JSON.stringify({questionId:parseInt(questionId)}),
        contentType: 'application/json',
        success: function(data) { questionDiv.remove() },
        error: displayAjaxError
    });
}

function addAnswerElement(el) {
    // find the question, add another answer option
    var answerHtml = '<div class="answer">' +
        '  <label for="answer-text">Answer Choice</label><input type="text" class="answer-text no-wrap" />' +
        '  <button type="button" class="remove-answer-button pure-button pure-button-error" onclick="removeAnswerElement(this);"><i class="fa fa-times"></i></button><br>' +
        '</div>';

    var target = $(el); // this will be the + button (with name=question-%questionId%)
    var answersDiv = target.siblings(".answers");
    answersDiv.append(answerHtml);
}

function removeAnswerElement(el) {
    var target = $(el);
    var answerDiv = target.parent();

    answerDiv.remove();
}


function editSurveyTitle() {
    console.log("Changing survey title is not implemented");
}


