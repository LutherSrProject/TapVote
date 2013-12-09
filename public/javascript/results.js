/**
 * Created by isaac on 10/29/13.
 */

// GLOBAL PAGE VARIABLES //
pageTitle = "Results";


$(function getSurveyInfo() {
    var survey = $.QueryString['survey'];
    if (survey) {
        $.ajax({
            type:'GET',
            url: AJAX_REQUEST_URL + '/getSurveyInfo',
            data: {surveyId: survey},
            success: displaySurveyInfo,
            error: displayAjaxError
        });
    } else {
        askForSurveyId();
    }
});

function getSurveyResults() {
    var survey = $.QueryString['survey'];
    if (survey) {
        $.ajax({
            type:'GET',
            url: AJAX_REQUEST_URL + '/getSurveyResults',
            data: {surveyId: survey},
            success: displaySurveyResults,
            error: displayAjaxError
        });
    }

    // poll for updated results every second
    setTimeout(getSurveyResults, 1000)
}

function displayAjaxError(error) {
    if (error.status == 404) {
        // 404 happens when the survey id is invalid
        askForSurveyId();
    } else {
        console.log(error);
    }
}

function askForSurveyId() {
    var titleDiv = $("#survey-title");
    titleDiv.text("Please enter a survey ID and click 'See Results'.");

    var idBox = $("<input id='survey-id' type='text' class='no-wrap survey-id-input-box' size='5' />");
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
    window.location.href="/?p=results&survey=" + $("#survey-id").val();
}

function displaySurveyResults(results) {
    $.each(results, function (key, value) {
        var elementId = '#answer-' + key;

        var resultSpan = $(elementId).find("div.answer-result");
        resultSpan.text(value);
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

        var answers = question['answers'];
        $.each(answers, function (index, answer) {
            var answerDiv = $("<div></div>");
            answerDiv.attr('id', 'answer-'+answer['id']);
            answerDiv.attr('class', 'answer rounded');

            // create the div that holds the textual value of this answer
            var questionValue = $("<div></div>");
            questionValue.attr("class", "answer-value");
            questionValue.text(answer['value']);

            // create the div that holds the count of responses for this answer
            var answerResultDiv  = $("<div></div>");
            answerResultDiv.attr("class", "answer-result");

            answerDiv.append(questionValue);
            answerDiv.append(answerResultDiv);

            questionDiv.append(answerDiv);
        });

        questionsDiv.append(questionDiv);
    });

    console.log(results);
    getSurveyResults();
}


$(window).load(function() {
// Load the Visualization API and the controls package.
  google.load("visualization", "1", {packages:["corechart"]});
  google.setOnLoadCallback(drawChart);
});
    
  // Set a callback to run when the Google Visualization API is loaded.
  


  // Callback that creates and populates a data table,
  // instantiates a dashboard, a range slider and a pie chart,
  // passes in the data and draws it.
function drawChart() {
        console.log("at least you made it here")
        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Work',     11],
          ['Eat',      2],
          ['Commute',  2],
          ['Watch TV', 2],
          ['Sleep',    7]
        ]);

        var options = {
          title: 'My Daily Activities'
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
      }
      
//$(document).load(function() {
//    google.load('visualization', '1.1', {packages: ['controls']});
//    google.setOnLoadCallback(drawVisualization);
//});
