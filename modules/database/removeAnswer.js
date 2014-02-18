var Q = require("q");
var runQuery = require("./runQuery").runQuery;

/*
curl -d  -H "Content-Type:application/json" http://localhost:8000/removeAnswer
 */


var removeAnswer = function(data, callback) {
    var questionId = data['questionId'];
    var answerId = data['answerId'];

    runQuery('SELECT * FROM answer WHERE id=$1', [answerId])
    .then(function (results) {
        var err = Error();
        if (results.rowCount == 0) {
            err['friendlyName'] = 'Tried to remove non-existent answer';
            err['httpStatus'] = 404;
            err['httpResponse'] = '404 Not Found';
            throw err;
        } else {
            var qid = results.rows[0].questionId;
            if (qid != questionId) {
                err['friendlyName'] = 'Given questionId and answerId do not match';
                err['httpStatus'] = 400;
                err['httpResponse'] = '400 Bad Request';
                throw err;
            } else {
                // actually do the delete
                return runQuery('DELETE FROM answer WHERE id=$1 AND "questionId"=$2', [answerId, questionId])
            }
        }
    })
    .then(function (results) {
        callback(null, results);
    })
    .fail(function (error) {
        if (!error['friendlyName']) {
            error['friendlyName'] = "Unknown error removing answer";
            error['httpStatus'] = 400;
            error['httpResponse'] = "400 Bad Request";
        }
        callback(error);
    });
};

exports.removeAnswer = removeAnswer;
