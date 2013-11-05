// eventually this plugin should be included in a global fashion
// usage: $.QueryString["param"]
(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);


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
    window.location.href="takesurvey.html?survey=" + $("#survey-id").val();
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
    $("#survey").append("<div id='vote-status'></div>");
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

function vote(questionId, answerId) {

}

/*$(function() {
    $('[name="best"]').click(function(event) {
        //put in variables
        $.ajax({
            type:"POST", 
            url:"/vote", 
            data:'{"answerId":"'+$(this).val()+'","questionId":"'+$(this).parent().attr("id")+'"}', 
            contentType: 'application/json',
            success: function(data) { console.log(data); },
            error: function(data) { console.log(data); }
		});
        event.preventDefault();
        return false; 
    });
});*/
//go to http://www.w3schools.com/jquery/jquery_traversing.asp for traversal help

