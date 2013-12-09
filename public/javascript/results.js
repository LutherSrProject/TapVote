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

    var surveyDiv = $("#survey-questions");
    var idBox = $("<input id='survey-id' type='text' size=5 />");
    var button = $("<button type='button'>See Results</button>");
    button.attr('onclick', 'redirectToSurvey()');

    surveyDiv.append(idBox);
    surveyDiv.append(button);
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
        questionDiv.attr('class', 'question');

        var questionTitle = $("<div></div>");
        questionTitle.text(question['value']);
        questionTitle.addClass('question-title');
        questionDiv.append(questionTitle);

        var answers = question['answers'];
        $.each(answers, function (index, answer) {
            var answerDiv = $("<div></div>");
            answerDiv.attr('id', 'answer-'+answer['id']);
            answerDiv.attr('class', 'answer');

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
