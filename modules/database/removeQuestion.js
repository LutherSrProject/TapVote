var Q = require("q");
var runQuery = require("./runQuery").runQuery;


var removeQuestion = function(data, callback) {
    // var data = {questionId: 2}
    var questionId = data['questionId'];

    runQuery("DELETE FROM question WHERE id=$1", [questionId])
        .then(function (results) {
                  if(results.rowCount == 0) {
                      var error = Error();
                      error['httpStatus'] = 404;
                      error['httpResponse'] = '404 Not Found';
                      error['friendlyName'] = "questionId does not exist";
                      throw error;
                  }
                  callback(null); // status success
                  return;
              })
        .fail(function (error) {
                  callback(error);
                  return;
              });
};


exports.removeQuestion = removeQuestion;
