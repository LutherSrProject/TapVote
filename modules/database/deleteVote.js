var Q = require("q");
var moment = require("moment");
var runQuery = require("./runQuery").runQuery;


var deleteVote = function (data, callback) {
    // data = {"questionId":5, "answerId":3}

    /* need to check that data['answerId'] has a questionId == data['questionId'] */
    runQuery('SELECT "questionId" FROM answer WHERE id=$1', [data['answerId']])
    .then(function (results) {
        var qid = results.rows[0].questionId;
        if(qid == data['questionId']) {
          return;
        } else {
            logger.error("Question doesn't have that answer as an option.");
            var error = Error();
            error['httpStatus'] = 400;
            error['httpResponse'] = '400 Bad Request';
            error['friendlyName'] = "questionId and answerId don't match";
            throw error;
        }
    })

    /* need to check that this survey is open (between start and finish datetimes) */
    .then(function (res) {
        var queryString, queryParams;
        if (data['surveyId']) {
            queryString = 'SELECT * FROM survey WHERE id = $1';
            queryParams = [data['surveyId']];
        } else {
            // if surveyId isn't provided, get it based on the (answerId, questionId) pair.
            queryString = 'SELECT * FROM survey WHERE id = (SELECT "surveyId" FROM question WHERE id = $1)';
            queryParams = [data['questionId']];
        }

        // find the survey info associated w/ this (questionId, answerId) pair.
        return runQuery(queryString, queryParams)
        .then(function (survey) {
            var error;
            var now = moment.utc();

            // check that now is after start
            if (survey.rows[0].start) {
                var start = moment.utc(survey.rows[0].start);
                if (now.isBefore(start)) { // survey isn't open yet
                    logger.warn("Survey isn't yet open. Start time is " + start.format());
                    error = new Error();
                }
            }
            // check that now is before finish
            if (survey.rows[0].finish) {
                var finish = moment.utc(survey.rows[0].finish);
                if (now.isAfter(finish)) { // survey is already closed
                    logger.warn("Survey is already closed. Finish time was " + finish.format());
                    error = new Error()
                }
            }

            if (error) {
                error['httpStatus'] = 400;
                error['httpResponse'] = '400 Bad Request';
                error['friendlyName'] = 'Survey is not open';
                throw error;
            }
        })
        .fail(function (error) {
            // propagate errors up the chain
            throw error;
        });
    })
    /* if previous conditions have been met, delete the vote */
    .then(function (results) {
        // This query is needed because Postgres doesn't support LIMIT in DELETE queries.
        // Here we're relying on the ctid column, which is the physical location of the row. It's not
        // a stable identifier over UPDATES, etc, but it works for this situation.
        // See for more info:
        // http://www.postgresql.org/message-id/07f0833692070125b9317094e7008b4f@biglumber.com
        var queryString = 'DELETE FROM vote WHERE ctid = (SELECT ctid FROM vote WHERE "questionId"=$1 AND "answerId"=$2 AND "userId"=$3 LIMIT 1)';
        return runQuery(queryString, [data['questionId'], data['answerId'], data['userId']])
        .then(function (res) {
            logger.info("Query success: deleted vote from database");
            callback(null, res);
            return;
        })
    })
    .fail(function (error) {
        logger.error("Failed to delete the vote from the database. ", error);
        callback(error);
        return;
    });
};

exports.deleteVote = deleteVote;
