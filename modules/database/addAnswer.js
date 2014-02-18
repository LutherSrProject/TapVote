var Q = require("q");
var runQuery = require("./runQuery").runQuery;

/*
curl -d {"questionId":2, "value":"apples"} -H "Content-Type:application/json" http://localhost:8000/addAnswers
 */


var addAnswer = function(data, callback) {
    var questionId = data['questionId'];
    var value = data['value'];

    runQuery("INSERT INTO answer(\"questionId\", value) VALUES($1, $2) RETURNING *", [questionId, value])
    .then(function (results) {
        var aid = results.rows[0].id;
        callback(null, {'answerId':aid}); // status success
    })
    .fail(function (error) {
        error['friendlyName'] = "Tried to add answer for non-existent questionId";
        error['httpStatus'] = 400;
        error['httpResponse'] = "404 Not Found";
        callback(error);
    });
};

exports.addAnswer = addAnswer;
