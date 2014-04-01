var Q = require("q");
var moment = require("moment");
var runQuery = require("./runQuery").runQuery;


var recordVote = function (voteData, callback) {
    // voteData = {'answerId':5, 'questionId':5}

    /* need to check that voteData['answerId'] has a questionId == voteData['questionId'] */
    runQuery('SELECT "questionId" FROM answer WHERE id=$1', [voteData['answerId']])
    .then(function (results) {
        var qid = results.rows[0].questionId;
        if (qid == voteData['questionId']) {
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
        if (voteData['surveyId']) {
            queryString = 'SELECT * FROM survey WHERE id = $1';
            queryParams = [voteData['surveyId']];
        } else {
            // if surveyId isn't provided, get it based on the (answerId, questionId) pair.
            queryString = 'SELECT * FROM survey WHERE id = (SELECT "surveyId" FROM question WHERE id = $1)';
            queryParams = [voteData['questionId']];
        }

        // find the survey info associated w/ this (questionId, answerId).
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
    /* if previous conditions have been met, insert the vote */
    .then(function (res) {
        return runQuery('INSERT INTO vote("answerId", "questionId", "userId") VALUES($1, $2, $3)', [voteData['answerId'], voteData['questionId'], voteData['userId']])
        .then(function (results) {
                logger.info("Recorded vote in database.");
                callback(null, results);
                return;
        })
    })
    .fail(function (error) {
        logger.error("Error logging vote to database. ", error);
        callback(error);
        return;
    });
};

exports.recordVote = recordVote;
