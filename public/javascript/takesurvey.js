// GLOBAL PAGE VARIABLES //
pageTitle = "Take Survey";
var previousMCSR = {};

$(function getSurveyInfo() {
    var survey = $.QueryString['survey'];
    if (survey) {
        $.ajax({
            type:'GET',
            url: AJAX_REQUEST_URL + '/getSurveyInfo',
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
    titleDiv.text("Please enter a survey ID and click 'Take Survey'.");

    var idBox = $("<input id='survey-id' class='no-wrap survey-id-input-box' type='text' size=5 />");
    var button = $("<button type='button' id='take-survey-button'>Take Survey</button>");
    button.addClass("pure-button pure-button-success pure-button-small");
    button.attr('onclick', 'redirectToSurvey()');

    var form = $("<form></form>");
    form.addClass("pure-form");
    form.attr("action", "javascript:$('#take-survey-button').click();");
    form.append(idBox);
    form.append(button);

    var surveyDiv = $("#survey-questions");
    surveyDiv.append(form);
}

function redirectToSurvey() {
    window.location.href="/?p=takesurvey&survey=" + $("#survey-id").val();
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
    el.addClass('survey-title');
    titleDiv.append(el);

    var questionsDiv = $("#survey-questions");
    questionsDiv.addClass("questions");
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

        var questionType = question['type'];
        var questionId = question['id'];

        var answers = question['answers'];
        $.each(answers, function (index, answer) {
            var answerId = answer['id'];
            var answerValue = answer['value'];

            var answerDiv = $("<div></div>");
            answerDiv.attr('id', 'answer-'+answerId);
            answerDiv.attr('class', 'answer rounded');

            var answerEl = $("<input />"); // the actual input element (radio, checkbox, etc)
            answerEl.attr('id', 'answer-'+questionType+'-'+answerId);
            answerEl.attr('data-question-id', questionId);
            answerEl.attr('data-answer-id', answerId);

            if (questionType == "MCSR") {
                answerEl.attr('name', 'question-'+questionId+'-answers');
                answerEl.attr('type', 'radio');
                answerEl.change(checkMCSR);
            }

            else if (questionType == "MCMR") {
                answerEl.attr('type', 'checkbox');
                // this works for checkbox because the 'change' event is fired on deselect as well as select
                answerEl.change(checkMCMR);
            }

            else {
                // unimplemented question type (i.e. MCRANK, FR, etc)
                console.log("WARNING: Encountered an unimplmemented question type: " + questionType);
                console.log("WARNING: Treating unknown type as MCSR!");

                // just treat this unknown type as an MCSR
                answerEl.attr('name', 'question-'+questionId+'-answers');
                answerEl.attr('type', 'radio');
                answerEl.change(checkMCSR);
            }


            answerDiv.append(answerEl);

            // make the label (containing the value of the answer_
            var answerLabel = $("<label></label>");
            answerLabel.attr('for', 'answer-'+questionType+'-'+answerId);
            answerLabel.text(answerValue);
            answerDiv.append(answerLabel);

            questionDiv.append(answerDiv);

        });
        questionsDiv.append(questionDiv);
    });

    console.log(results);
}

function checkMCSR(event) {
    var el = $(this);
    var questionId = parseInt(el.attr('data-question-id'));
    var answerId = parseInt(el.attr('data-answer-id'));

    // send a deVote for the old answer before submitting the new vote
    var prevAnswerId = previousMCSR[questionId];
    if (prevAnswerId || prevAnswerId === 0) {
        deVote(questionId, prevAnswerId);
    }

    // send vote for newly select answer, and remember this vote (so that we can properly
    // deVote if the user changes their vote)
    previousMCSR[questionId] = answerId;
    submitVote(questionId, answerId);
}

function checkMCMR(event) {
    var el = $(this);
    var questionId = parseInt(el.attr('data-question-id'));
    var answerId = parseInt(el.attr('data-answer-id'));

    // if newly checked, submit a vote
    if (this.checked) {
        submitVote(questionId, answerId);
    }

    // if unchecked, send a deVote
    if (! this.checked) {
        deVote(questionId, answerId);
    }
}

function deVote(questionId, answerId) {
    var data = { "questionId": questionId, "answerId": answerId};

    var el = $("input[data-answer-id=" + answerId + "]").parent();
    el.removeClass("highlight-green");
    el.removeClass("highlight-red");
    el.addClass("highlight-orange");

    $.ajax({
        type: 'POST',
        url: AJAX_REQUEST_URL + '/deVote',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: showDevoteSuccess,
        error: showDevoteFailure
    });

    function showDevoteSuccess(results) {
        console.log(results);
        el.removeClass("highlight-orange");
        el.removeClass("highlight-red");
        el.removeClass("highlight-green");
    }

    function showDevoteFailure(results) {
        console.log("Error submitting vote: ");
        console.log(results);
    }
}

function submitVote(questionId, answerId) {
    var data = { "questionId": questionId, "answerId": answerId};

    var el = $("input[data-answer-id=" + answerId + "]").parent();
    el.removeClass("highlight-green");
    el.removeClass("highlight-red");
    el.addClass("highlight-orange");

    $.ajax({
        type: 'POST',
        url: AJAX_REQUEST_URL + '/vote',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: showSubmitSuccess,
        error: showSubmitFailure
    });

    function showSubmitSuccess(results) {
        console.log(results);
        el.removeClass("highlight-orange");
        el.removeClass("highlight-red");
        el.addClass("highlight-green");
    }

    function showSubmitFailure(results) {
        console.log("Error submitting vote: ");
        console.log(results);
        el.removeClass("highlight-orange");
        el.removeClass("highlight-green");
        el.addClass("highlight-red");
    }
}



