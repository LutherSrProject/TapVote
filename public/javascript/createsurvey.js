// GOBAL PAGE VARIABLES //
pageTitle = "Create Survey";

function removeAnswer(el) {
    var target = $(el);
    var answerDiv = target.parent();

    answerDiv.remove();
}


$(document).ready(function () {
    $('[name="createQuestion"]').click(function (event) {
        return false;
    });

    $('.add-answer').click(function (event) {
        // find the question, add another answer option
        var target = $(event.target); // this will be the + button (with name=question-%questionId%)
        var targetName = target.attr('name');

        var answerHtml = '<div class="answer">' +
                         '  Answer Choice: <input type="text" class="answer-text" name="' + targetName + '" /> ' +
                         '  <button type="button" class="remove-answer" name="question-1" onclick="removeAnswer(this);"> x </button> <br />' +
                         '</div>';

        $("#" + targetName).find(".answers").append(answerHtml);

    });

    $('[name="createSurvey"]').click(function (event) {
        var title = $("#title").val();
        var password = $("#adminPwd").val();

        var questions = [];
        var mcQuestions = $(".questions").find(".question");
        $.each(mcQuestions, function (i, val) {
            var el = $(val);
            var answerList = [];
            var questionText = el.find(".question-text").val();

            var answers = el.find(".answer-text");
            $.each(answers, function (idx, v) {
                var answerText = $(v).val();
                answerList.push(answerText);
            });

            var question = {"question":questionText, "answers":answerList};
            questions.push(question);
        });

        var data = {"title":title, "questions":questions, "password": password};
        var jsonData = JSON.stringify(data);
        $.ajax({
            type: "POST",
            url: "/createSurvey",
            data: jsonData,
            contentType: 'application/json',
            success: function (data) {
               shareSurvey(data["surveyId"])
            },
            error: function (data) {
               console.log(data);
            }
        });
        event.preventDefault();

        return false;
    });

    function shareSurvey(id) {
        var takesurveyLink = "/?p=takesurvey&survey=" + id;
        var adminsurveyLink = "/?p=results&survey=" + id;

        var takesurvey = "<br> To take your survey go to " +
                         "<a href='" + takesurveyLink + "'>" +
                         "TapVote.com" + takesurveyLink + "</a><br>";

        var adminsurvey = "To view the results of your survey go to " +
                          "<a href='" + adminsurveyLink + "'>" +
                          "TapVote.com" + adminsurveyLink + "</a><br>";

        $("article").append(takesurvey);
        $("article").append(adminsurvey);

    }
});
  
