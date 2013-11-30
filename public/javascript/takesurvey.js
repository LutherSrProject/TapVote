// GLOBAL PAGE VARIABLES //
pageTitle = "Take Survey";
var previousMCSR = {};

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

        var questionType = question['type'];
        var questionId = question['id'];

        var answers = question['answers'];
        $.each(answers, function (index, answer) {
            var answerId = answer['id'];
            var answerValue = answer['value'];

            var answerDiv = $("<div></div>");
            answerDiv.attr('id', 'answer-'+answerId);
            answerDiv.attr('class', 'answer');

            var answerEl = $("<input />"); // the actual input element (radio, checkbox, etc)
            answerEl.attr('id', 'answer-'+questionType+'-'+answerId);
            answerEl.attr('data-question-id', questionId);
            answerEl.attr('data-answer-id', answerId);

            if (questionType == "MCSR") {
                answerEl.attr('name', 'question-'+questionId+'-answers');
                answerEl.attr('type', 'radio');
                answerEl.change(checkMCSR);
            }

            if (questionType == "MCMR") {
                answerEl.attr('type', 'checkbox');
                // this works for checkbox because the 'change' event is fired on deselect as well as select
                answerEl.change(checkMCMR);
            }

            else {
                // unimplemented question type (i.e. MCRANK, FR, etc)
                console.log("WARNING: Encountered an unimplmemented question type: " + questionType);
                console.log("WARNING: Treating unknown type as MCSR!");

                // just treat this unkown type as an MCSR
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

    $("#survey").append("<br><br><div id='vote-status'></div>");
    console.log(results);
}

function checkMCSR(event) {
    var el = $(this);
    var questionId = parseInt(el.attr('data-question-id'));
    var answerId = parseInt(el.attr('data-answer-id'));

    // send a deVote for the old answer before submitting the new vote
    var prevAnswerId = previousMCSR['questionId'];
    if (prevAnswerId) {
        deVote(questionId, prevAnswerId);
    }

    // send vote for newly select answer, and remember this vote
    previousMCSR['questionId'] = answerId;
    submitVote(questionId, answerId);
}

function checkMCMR(event) {
    var el = $(this);
    var questionId = parseInt(el.attr('data-question-id'));
    var answerId = parseInt(el.attr('data-answer-id'));

    if (this.checked) {
        submitVote(questionId, answerId);
    }

    if (! this.checked) {
        deVote(questionId, answerId);
    }
}

function deVote(questionId, answerId) {
    var data = { "questionId": questionId, "answerId": answerId};

    $.ajax({
        type: 'POST',
        url: '/deVote',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (results) { console.log(results); },
        error: function (results) { console.log(results); }
    })
}

function submitVote(questionId, answerId) {
    var data = { "questionId": questionId, "answerId": answerId};

    $.ajax({
        type: 'POST',
        url: '/vote',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: showSubmitSuccess,
        error: showSubmitFailure
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


