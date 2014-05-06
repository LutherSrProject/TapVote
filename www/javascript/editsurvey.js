// GLOBAL PAGE VARIABLES //
pageTitle = "Edit Survey";


$(getSurveyInfo);

function getSurveyInfo() {
    var survey = $.QueryString['survey'];
    if (survey) {
        showLoadingIndicator();
        $.ajax({
            type:'GET',
            url: AJAX_REQUEST_URL + '/getSurveyInfo',
            data: {surveyId: survey},
			xhrFields: { withCredentials: true },
            success: checkAuthentication,
            error: displayAjaxError
        });
    } else {
        askForSurveyId();
    }
}

function askForSurveyId() {
    hideLoadingIndicator();

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


function checkAuthentication(results) {
    if (results.canEdit)
        displaySurvey(results);
    else {
        hideLoadingIndicator();
        var titleDiv = $("#survey-title");
        titleDiv.text("Please enter your password to edit the survey.");

        var pwBox = $("<input id='editpassword' class='no-wrap' type='password' />");
        var button = $("<button type='button' id='edit-survey-button'>Edit Survey</button>");
        button.addClass("pure-button pure-button-success pure-button-small");

        var form = $("<form></form>");
        form.addClass("pure-form");
        form.attr("action", "javascript:$('#edit-survey-button').click();");
        form.append(pwBox);
        form.append(button);

        var surveyDiv = $("#survey-questions");
        surveyDiv.append(form);

        var survey = $.QueryString['survey'];
        surveyDiv.append("<input type='hidden' id='survey-id' value='" + survey + "' />");

        $("#edit-survey-button").click(function () {
            showLoadingIndicator();
            var password = $("#editpassword").val();
            $.ajax({
                type:'POST',
                url: AJAX_REQUEST_URL + '/authenticate',
                data: { surveyAuth: { surveyId: survey, editPassword: password} },
                xhrFields: { withCredentials: true },
                success: redirectToSurvey,
                error: function (r) { console.log(r); incorrectPassword(results); }
            });
        });
    }
}

function incorrectPassword(results) {
    hideLoadingIndicator();

    var incorrectIndicator = $("#survey-questions .incorrect")[0];
    if (!incorrectIndicator)
        $("#survey-questions form").append("<div class='incorrect'>Incorrect password</div>");
}

function redirectToSurvey() {
    window.location.href="?p=editsurvey&survey=" + $("#survey-id").val();
}

function displayAjaxError(error) {
    if (error.status == 404)
        askForSurveyId(); // 404 happens when an invalid survey ID is specified
    else
        console.log(error);
}


function displaySurvey(results) {
    hideLoadingIndicator();
    var titleDiv = $("#survey-title");
    titleDiv.text(results['title']);

    var infoDiv = $("#survey-info");
    var surveyId =$.QueryString['survey'];
    var idtext = "Survey ID: "+ surveyId;
    infoDiv.text(idtext);
    var surveyButtons = $("<div></div>");
    surveyButtons.addClass("survey-buttons");
    
    var take = $("<a></a>");
    take.attr('href',"?p=takesurvey&survey="+surveyId);
    take.attr('id', "take-survey");
    take.attr('class', "pure-button pure-button-warning pure-button-small");
    take.text("Take This Survey");
    surveyButtons.append(take);
    
    var showResults = $("<a></a>");
    showResults.attr('href',"?p=results&survey="+surveyId);
    showResults.attr('id', "show-results");
    showResults.attr('class', "pure-button pure-button-warning pure-button-small");
    showResults.text("Show the Results");
    surveyButtons.append(showResults);
    infoDiv.append(surveyButtons);

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
        
        var typeStr = getTypeStr(question['type'])
        var questionType =$("<div></div>");
        questionType.text(typeStr);
        questionType.addClass('question-type');
        questionDiv.append(questionType)

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
    var typeStr = getTypeStr(type)
    
    var questionHtml = '<div class="question rounded ' + type + '" data-question-type="'+type+'">' +
        '  <button type="button" class="remove-question-button pure-button pure-button-error" onclick="removeQuestionElement(this);"><i class="fa fa-times fa-lg"></i></button> ' +
        '<div class="question-type">' + typeStr + '</div>' +
        '  <label for="question-text">Question</label><input type="text" class="question-text" />';

    if (type != 'FR') {
        questionHtml +=
            '  <div class="answers">' +
            '    <div class="answer">' +
            '     <input type="text" placeholder="Answer Choice" class="answer-text no-wrap" />' +
            '     <button type="button" class="remove-answer-button pure-button pure-button-error" onclick="removeAnswerElement(this);"><i class="fa fa-times"></i></button><br>' +
            '    </div>' +
            '  </div>' +
            '  <button type="button" class="add-answer-button pure-button pure-button-success pure-button-small" style="vertical-align:-7px;" onclick="addAnswerElement(this);"><i class="fa fa-plus"></i></button>';
    }

    questionHtml += '  <button type="button" class="pure-button pure-button-primary pure-button-small" onclick="saveQuestion(this);">Save Question</button>';
    questionHtml += '</div>';

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
        url: AJAX_REQUEST_URL + "/addQuestions",
        data: data,
		xhrFields: { withCredentials: true },
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
        url: AJAX_REQUEST_URL + '/removeQuestion',
        data: JSON.stringify({questionId:parseInt(questionId)}),
		xhrFields: { withCredentials: true },
        contentType: 'application/json',
        success: function(data) { questionDiv.remove() },
        error: displayAjaxError
    });
}

function addAnswerElement(el) {
    // find the question, add another answer option
    var answerHtml = '<div class="answer">' +
        '  <input type="text" placeholder="Answer Choice" class="answer-text no-wrap" />' +
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




