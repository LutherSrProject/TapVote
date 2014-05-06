// GLOBAL PAGE VARIABLES //
pageTitle = "Take Survey";
var previousMCSR = {};
var previousFR = {};

$(function getSurveyInfo() {
    var survey = $.QueryString['survey'];
    if (survey) {
        showLoadingIndicator();
        $.ajax({
            type:'GET',
            url: AJAX_REQUEST_URL + '/getSurveyInfo',
            data: {surveyId: survey},
            xhrFields: { withCredentials: true },
            success: getUserVotes,
            error: displayAjaxError
        });
    } else {
        askForSurveyId();
    }
});

function getUserVotes(surveyInfo) {
    var survey = $.QueryString['survey'];
    $.ajax({
        type:'GET',
        url: AJAX_REQUEST_URL + '/getUserVotes',
        data: {surveyId: survey},
        xhrFields: { withCredentials: true },
        success: function(results) { combineSurveyInfo(surveyInfo, results); },
        error: displayAjaxError
    });

}

function combineSurveyInfo(surveyInfo, userVotes) {
    $.each(surveyInfo.questions, function(index, question) {
        $.each(question.answers, function(i, answer) {
            if (userVotes[answer.id]) {
                answer.voted = true;
            }
        });
    });

    displaySurvey(surveyInfo);
}

function askForSurveyId() {
    // This function is called when a survey Id isn't provided or when an invalid sId is given
    var titleDiv = $("#survey-title");
    titleDiv.text("Please enter a survey ID and click 'Take Survey'.");

    var idBox = $("<input id='survey-id' class='no-wrap survey-id-input-box' type='text' size=5 autofocus />");
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
    window.location.href = "?p=takesurvey&survey=" + $("#survey-id").val();
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
        questionDiv.attr('class', 'question rounded pure-form');

        var questionType = question['type'];
        var typeStr = getTypeStr(questionType);
        
        var questionTypeDiv =$("<div></div>");
        questionTypeDiv.text(typeStr);
        questionTypeDiv.addClass('question-type');
        questionDiv.append(questionTypeDiv);
            
        var questionTitle = $("<div></div>");
        questionTitle.text(question['value']);
        questionTitle.addClass('question-title');
        questionDiv.append(questionTitle);

        var questionId = question['id'];

        // FR type is different - don't display any answers from a server.
        // Instead, allow the user to enter their own textual answer.
        if (questionType == "FR") {
            var answer;
            $.each(question.answers, function (ind, ans) {
                if (ans.voted)
                    answer = ans;
            });

            var answerDiv = $('<div></div>');
            answerDiv.attr('class', 'answer rounded');

            var answerEl = $('<input />');
            answerEl.attr('type', 'text');
            answerEl.addClass('FR');
            answerEl.attr('data-question-id', questionId);

            if (answer) {
                answerEl.val(answer.value);
                answerDiv.addClass('highlight-green');
                previousFR[questionId] = { val:answer.value, id:answer.id };
            }

            /* the below code changes the highlight of the input element based on the current status:
             * If the answer has been changed and the user hasn't saved it - highlight orange
             * If the answer has been changed since last save - highlight green
             * If the last save attempt failed - highlight red
             */
            answerEl.data('oldVal', answerEl.val());
            // Look for changes in the value
            answerEl.bind("propertychange keyup input paste", function (event) {
                // If value has changed...
                if (answerEl.data('oldVal') != answerEl.val()) {
                    // Updated stored value
                    answerEl.data('oldVal', answerEl.val());

                    // Do action
                    answerEl.parent().removeClass("highlight-red");
                    answerEl.parent().removeClass("highlight-green");
                    answerEl.parent().addClass("highlight-orange");

                }
            });
            //"pure-button pure-button-tiny pure-button-warning"
            var saveLink = $('<button></button>');
            saveLink.attr('class', "pure-button pure-button-small pure-button-success pure-button-save");
            saveLink.attr('href', 'javascript:void(0);');
            saveLink.attr('onclick', 'checkFR(' + questionId + ')');
            saveLink.text('Save');

            answerDiv.append(answerEl);
            answerDiv.append(saveLink);
            questionDiv.append(answerDiv);
        } else {
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
                    // unimplemented question type (i.e. MCRANK, etc)
                    console.log("WARNING: Encountered an unimplemented question type: " + questionType);
                    console.log("WARNING: Treating unknown type as MCSR!");

                    // just treat this unknown type as an MCSR
                    answerEl.attr('name', 'question-'+questionId+'-answers');
                    answerEl.attr('type', 'radio');
                    answerEl.change(checkMCSR);
                }

                if (answer.voted) {
                    answerEl.prop("checked", true);
                    answerDiv.addClass("highlight-green");
                    if (questionType == "MCSR")
                        previousMCSR[questionId] = answerId;
                }

                answerDiv.append(answerEl);

                // make the label (containing the value of the answer_
                var answerLabel = $("<label></label>");
                answerLabel.attr('for', 'answer-'+questionType+'-'+answerId);
                answerLabel.text(answerValue);
                answerDiv.append(answerLabel);

                questionDiv.append(answerDiv);

            });
        }
        questionsDiv.append(questionDiv);
        
        var surveyId =$.QueryString['survey'];

        resultsButton = $("<a></a>");
        resultsButton.attr('id', "show-results");
        resultsButton.attr('class', "pure-button pure-button-success");
        resultsButton.attr('href', "?p=results&survey=" + surveyId);
        resultsButton.text("View Results");
        $('#content').append(resultsButton);
        
    });
}

function checkFR(questionId) {
    // get free-text answer, perform some basic sanity checks.
    // Then, create a new answer (/addAnswer) and submit a vote for it!
    var answerEl = $("input[data-question-id=" + questionId + "]");
    var val = answerEl.val();

    if (previousFR[questionId]) {
        if (val == previousFR[questionId]['val']) {
            // don't need to do anything - answer hasn't changed
            console.log("Answer unchanged - not saving");

            answerRow = answerEl.parent();
            answerRow.removeClass("highlight-orange");
            answerRow.removeClass("highlight-red");
            answerRow.addClass("highlight-green");
            return;
        }

        // if we have a previous answer for this question, delete it before submitting the new answer
        var oldData = JSON.stringify({"questionId":questionId, "answerId":previousFR[questionId]["id"]});
        $.ajax({
            type: 'POST',
            url: AJAX_REQUEST_URL + '/removeAnswer',
            data: oldData,
            xhrFields: { withCredentials: true },
            contentType: "application/json",
            success: function (results) { console.log("delete answer success")},
            error: function (error) { console.log("delete answer failure!", error)}
        });
    }

    // add the new answer and vote
    var data = {"questionId": questionId, "value": val};
    $.ajax({
        type: 'POST',
        url: AJAX_REQUEST_URL + '/addAnswer',
        data: JSON.stringify(data),
        xhrFields: { withCredentials: true },
        contentType: "application/json",
        success: addAnswerSuccess,
        error: addAnswerFailure
    });

    function addAnswerSuccess(results) {
        console.log(results);
        var answerId = results['answerId'];
        answerEl.attr('data-answer-id', answerId);
        submitVote(questionId, answerId);

        // save the answer so we can delete it later if the user changes their answer
        previousFR[questionId] = {'val':val, 'id':answerId};
    }

    function addAnswerFailure(results) {
        console.log("shit, something broke.", results);
        var el = answerEl.parent();
        el.removeClass("highlight-orange");
        el.removeClass("highlight-green");
        el.addClass("highlight-red");
        console.log(results);
    }
}

function checkMCSR(event) {
    var el = $(this);
    var questionId = parseInt(el.attr('data-question-id'));
    var answerId = parseInt(el.attr('data-answer-id'));

    // send a deVote for the old answer before submitting the new vote
    var prevAnswerId = previousMCSR[questionId];
    if (prevAnswerId || prevAnswerId === 0) {
        deVote(questionId, prevAnswerId, function cb() {
            // send vote for newly select answer, and remember this vote (so that we can properly
            // deVote if the user changes their vote)
            previousMCSR[questionId] = answerId;
            submitVote(questionId, answerId);
        });
    } else {
        // send vote for newly select answer, and remember this vote (so that we can properly
        // deVote if the user changes their vote)
        previousMCSR[questionId] = answerId;
        submitVote(questionId, answerId);
    }

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
    if (!this.checked) {
        deVote(questionId, answerId);
    }
}

function deVote(questionId, answerId, callback) {
    var data = { "questionId": questionId, "answerId": answerId};

    var el = $("input[data-answer-id=" + answerId + "]").parent();
    el.removeClass("highlight-green");
    el.removeClass("highlight-red");
    el.addClass("highlight-orange");

    $.ajax({
        type: 'POST',
        url: AJAX_REQUEST_URL + '/deVote',
        data: JSON.stringify(data),
        xhrFields: { withCredentials: true },
        contentType: "application/json",
        success: function(results) {
            showDevoteSuccess(results);
            if (callback) {
                callback();
            }
        },
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
        xhrFields: { withCredentials: true },
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



