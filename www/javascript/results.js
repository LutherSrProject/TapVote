/**
 * Created by isaac on 10/29/13.
 */

// GLOBAL PAGE VARIABLES //
pageTitle = "Results";
initialLoad = true;

$(getSurveyInfo());

function getSurveyInfo() {
    var survey = $.QueryString['survey'];
    if (survey) {
        if (initialLoad)
            showLoadingIndicator();
        $.ajax({
            type:'GET',
            url: AJAX_REQUEST_URL + '/getSurveyInfo',
            data: {surveyId: survey},
            xhrFields: { withCredentials: true },
            success: getSurveyResults,
            error: displayAjaxError
        });

    } else {
        askForSurveyId();
    }
}

function getSurveyResults(surveyInfo) {
    var survey = $.QueryString['survey'];
    $.ajax({
        type:'GET',
        url: AJAX_REQUEST_URL + '/getSurveyResults',
        data: {surveyId: survey},
        xhrFields: { withCredentials: true },
        success: function (surveyResults) { getSurveyTotalVotersByQuestion(surveyInfo, surveyResults); },
        error: displayAjaxError
    });
}

function getSurveyTotalVotersByQuestion(surveyInfo, surveyResults) {
    var survey = $.QueryString['survey'];
    $.ajax({
        type: 'GET',
        url: AJAX_REQUEST_URL + '/getSurveyTotalVotersByQuestion',
        data: {surveyId: survey},
        xhrFields: { withCredentials: true },
        success: function(results) { combineSurveyInfo(surveyInfo, surveyResults, results); },
        error: displayAjaxError
    })
}

function displayAjaxError(error) {
    if (error.status == 404) {
        // 404 happens when the survey id is invalid
        askForSurveyId();
    } else {
        console.log(error);

        setTimeout(getSurveyInfo, 1000);
    }
}

function askForSurveyId() {
    var titleDiv = $("#survey-title");
    titleDiv.text("Please enter a survey ID and click 'See Results'.");

    var idBox = $("<input id='survey-id' type='text' class='no-wrap survey-id-input-box' size='5' autofocus />");
    var button = $("<button type='button' id='see-results-button'>See Results</button>");
    button.addClass("pure-button pure-button-success pure-button-small");
    button.attr('onclick', 'redirectToSurvey()');

    var form = $("<form></form>");
    form.addClass("pure-form");
    form.attr("action","javascript:$('#see-results-button').click();");
    form.append(idBox);
    form.append(button);

    var surveyDiv = $("#survey-questions");
    surveyDiv.append(form);
}

function redirectToSurvey() {
    window.location.href="?p=results&survey=" + $("#survey-id").val();
}

function combineSurveyInfo(surveyInfo, surveyResults, totalVotersByQuestion) {
    // combine the survey info (containing questions and answer options) with the results
    // (containing the number of votes for each answer)
    $.each(surveyInfo.questions, function (_, question) {
        question.totalVoters = totalVotersByQuestion[question.id];
        $.each(question.answers, function (_, answer) {
            answer.votes = surveyResults[answer.id]
        })
    });

    // surveyInfo now has all information, including results (# of votes)
    displaySurvey(surveyInfo)
}

function displaySurvey(surveyInfo) {
    hideLoadingIndicator();
    initialLoad = false;

    var answerList = [];
    var max = 0;
    $.each(surveyInfo.questions, function(index, question) {
        $.each(question.answers, function(i, answer) {
            max = Math.max(max, answer.votes);
            answerList.push(answer);
        })
    });
    if (!max) max = 0;

    // D3 scaling function - will be used later
    var x = d3.scale.linear()
        .domain([0, max])
        .range([0, 1]);


    var questions = d3.select("#survey-questions .questions")
        .selectAll("div.question")
        .data(surveyInfo.questions);

    var questionDivs = questions.enter().append("div") // this creates the question divs
        .html(function(d) {
            return "<div class='question-title'>" + d.value + "</div><span class='voters'>(" + d.totalVoters + " total voters)</span>";
        })
        .attr("class", "question chart rounded")
        .attr("data-question-type", function (d) { return d.type; });

    questions.exit().remove();


    var answers = questionDivs
        .selectAll("div.answer")
        .data(function(d) { return d.answers; });

    var answerDivs = answers.enter().append("div") // this creates the nested answer divs
        .text(function(d) { return d.value; })
        .attr("class", "answer");

    answers.exit().remove();


    var answerResults = answerDivs
        .selectAll("div.bar")
        .data(function(d) { return [d] });

    answerResults.enter().append("div")
        .style("width", function(d) {
                   //return x(d.votes) + "px"; // leave in; TODO check performance of this query every time
                   return ($(this.parentNode).width() * x(d.votes)) + "px";
        })
        .style("display", function (d) {
            var p = $(this).parents(".question");
            if (p.attr("data-question-type") == "FR")
                return "none";
            else
                return "default";
        })
        .text(function(d) { return d.votes; })
        .attr("class", "bar");

    answerResults.exit().remove();



    // handle realtime updates of the number of users who've voted on each question (totalVoters)
    d3.select("#survey-questions .questions")
        .selectAll("div.question")
        .select('.voters')
            .data(surveyInfo.questions, function(d) { return d.id; })
        .transition()
            .text(function(d) {
                return "(" + d.totalVoters + " total voters)";
            });

    // handle realtime updates of vote totals
    d3.select("#survey-questions .questions")
        .selectAll("div.question")
        .selectAll("div.answer")
        .selectAll("div.bar")
            .data(answerList, function(d) { return d.id; })
        .transition()
            .style("width", function(d) {
                //return x(d.votes) + "px"; // leave in; TODO check performance of this query every time
                return ($(this.parentNode).width() * x(d.votes)) + "px";
            })
            .text(function(d) { return d.votes; });

    // handle realtime updates of answer choices (specifically for new FR responses)
    var answers = d3.select("#survey-questions .questions")
        .selectAll("div.question")
            .data(surveyInfo.questions, function (d) { return d.id; })
        .selectAll("div.answer")
            .data(function (d) { return d.answers; })

    answers.enter().append("div")
        .text(function (d) { return d.value; })
        .attr('class', 'answer');
    answers.exit().remove();
    answers.transition()
        .text(function (d) { return d.value; });

    setTimeout(getSurveyInfo, 1000);
}
