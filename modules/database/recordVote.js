var Q = require("q");
var runQuery = require("./runQuery").runQuery;


var recordVote = function (voteData, callback) {
    // voteData = {'answerId':5, 'questionId':5}

    // need to check that voteData['answerId'] has a questionId == voteData['questionId']
    runQuery('SELECT "questionId" FROM answer WHERE id=$1', [voteData['answerId']])
        .then(function (results) {
                  var qid = results.rows[0].questionId;
                  if(qid == voteData['questionId']) {
                      return;
                  } else {
                      throw Error();
                  }
              })
        .then(function (results) {
                  runQuery('INSERT INTO vote("answerId", "questionId") VALUES($1, $2)', [voteData['answerId'], voteData['questionId']])
                      .then(function (results) {
                                logger.info("Recorded vote in database.");
                                callback(null, results);
                                return;
                            })
                      .fail(function (error) {
                                logger.error("Error logging vote to database.", error);
                                callback(error);
                                return;
                            });

              })
        .fail(function (error) {
                  logger.error("Question doesn't have that answer as an option.", error);
                  error['httpStatus'] = 400;
                  error['httpResponse'] = '400 Bad Request';
                  error['friendlyName'] = "questionId and answerId don't match";
                  callback(error);
                  return;
              });
};


exports.recordVote = recordVote;
