var Q = require("q");
var runQuery = require("./runQuery").runQuery;

/*
curl -d {"answers": [{"questionId":2, "value":"apples"}]} -H "Content-Type:application/json" http://localhost:8000/addAnswers
 */


var addAnswers = function(data, callback) {
    var answers = data['answers'];

    Q.all(answers.map(function (answer) {
        var value = answer["value"];
        var questionId = answer["questionId"];

        return runQuery("INSERT INTO answer(\"questionId\", value) VALUES($1, $2) RETURNING *", [questionId, value])
        .fail(function (error) {
            error['friendlyName'] = "Tried to add answer for non-existent questionId";
            error['httpStatus'] = 400;
            error['httpResponse'] = "404 Not Found";
            throw error;
        })
        .thenResolve();
    }))
    .then(function (results) {
        callback(null); // status success
    })
    .fail(function (error) {
        callback(error);
    });
};

exports.addAnswers = addAnswers;
