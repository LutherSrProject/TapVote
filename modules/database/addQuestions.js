var Q = require("q");
var runQuery = require("./runQuery").runQuery;


var addQuestions = function(data, callback) {
    // { "surveyId":1,
    //   "questions": [
    //       { "question": "Which is best?",
    //         "answers": [
    //              "Puppies",
    //              "Cheese",
    //              "Joss Whedon",
    //              "Naps"
    //         ]
    //       }
    //   ],
    //   "password":"supersecretpassword" }
    var surveyId = data["surveyId"];
    var questions = data["questions"];

    Q.all(questions.map(function (question) {
        var value = question["question"];
        var type = question["type"];
        var answers = question["answers"];

        return runQuery("INSERT INTO question(\"surveyId\", value, type) VALUES($1, $2, $3) RETURNING *", [surveyId, value, type])
        .then(function (results) {
            var questionId = results.rows[0].id;
            return Q.all(answers.map(function (answer) {
                return runQuery("INSERT INTO answer(\"questionId\", value) VALUES($1, $2)", [questionId, answer])
            }))
            .thenResolve();
        });
    }))
    .then(function (results) {
        callback(null); // status success
    })
    .fail(function (error) {
        callback(error);
    });
};

exports.addQuestions = addQuestions;