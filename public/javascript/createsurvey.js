// GOBAL PAGE VARIABLES //
pageTitle = "Create Survey";

function removeAnswer(el) {
    var target = $(el);
    var answerDiv = target.parent();

    answerDiv.remove();
}

function addAnswer(el) {
    // find the question, add another answer option
    var answerHtml = '<div class="answer">' +
        '  Answer Choice: <input type="text" class="answer-text"/> ' +
        '  <button type="button" class="remove-answer" onclick="removeAnswer(this);"> x </button> <br />' +
        '</div>';

    var target = $(el); // this will be the + button (with name=question-%questionId%)
    var answersDiv = target.siblings(".answers");
    answersDiv.append(answerHtml);

}

function removeQuestion(el) {
    var target = $(el);
    var questionDiv = target.parent();

    questionDiv.remove();
}

$(document).ready(function () {
    $('[name="createQuestion"]').click(function (event) {
        var questionHtml = '<div class="question mcsr">' +
                           '  Question: <input type="text" size="40" class="question-text" /> <br>' +
                           '  <div class="answers">' +
                           '    <div class="answer">' +
                           '      Answer Choice: <input type="text" class="answer-text" />' +
                           '     <button type="button" class="remove-answer" onclick="removeAnswer(this);"> x </button><br>' +
                           '    </div>' +
                           '  </div>' +
                           '  <button type="button" class="add-answer" onclick="addAnswer(this);"> + </button>' +
                           '  <button type="button" class="remove-question" onclick="removeQuestion(this);">Remove Question</button>' +
                           '  <br /><br />' +
                           '</div>';

        $(".questions").append(questionHtml);
        return false;
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
  
