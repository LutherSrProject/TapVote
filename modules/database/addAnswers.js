var Q = require("q");
var runQuery = require("./runQuery").runQuery;

/*
data = {"answers": [{"questionId":2, "value":"apples"}]}
 */


var addAnswers = function(data, callback) {
    var answers = data['answers'];

    Q.all(answers.map(function (answer) {
        var value = answer["value"];
        var questionId = answer["questionId"];

        return runQuery("INSERT INTO answer(\"questionId\", value) VALUES($1, $2) RETURNING *", [questionId, value])
    }))
    .then(function (results) {
        callback(null); // status success
    })
    .fail(function (error) {
        callback(error);
    });
};

exports.addAnswers = addAnswers;
