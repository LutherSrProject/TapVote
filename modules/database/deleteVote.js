var Q = require("q");
var runQuery = require("./runQuery").runQuery;


var deleteVote = function (data, callback) {
    // data = {"questionId":5, "answerId":3}

    // need to check that data['answerId'] has a questionId == data['questionId']
    runQuery('SELECT "questionId" FROM answer WHERE id=$1', [data['answerId']])
    .then(function (results) {
        var qid = results.rows[0].questionId;
        if(qid == data['questionId']) {
          return;
        } else {
          throw Error();
        }
    })
    .then(function (results) {
        // This query is needed because Postgres doesn't support LIMIT in DELETE queries.
        // Here we're relying on the ctid column, which is the physical location of the row. It's not
        // a stable identifier over UPDATES, etc, but it works for this situation.
        // See for more info:
        // http://www.postgresql.org/message-id/07f0833692070125b9317094e7008b4f@biglumber.com
        var queryString = 'DELETE FROM vote WHERE ctid = (SELECT ctid FROM vote WHERE "questionId"=$1 AND "answerId"=$2 LIMIT 1)';
        runQuery(queryString, [data['questionId'], data['answerId']])
        .then(function (res) {
            logger.info("Query success: deleted vote from database");
            callback(null, res);
            return;
        })
        .fail(function (error) {
            logger.error("Query fail: error deleting vote from database");
            callback(error);
            return;
        })
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

exports.deleteVote = deleteVote;