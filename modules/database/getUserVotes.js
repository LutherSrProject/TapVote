var Q = require("q");
var runQuery = require("./runQuery").runQuery;


var getUserVotes = function (surveyData, callback) {
    // surveyData = {'surveyId':34}
    // callback needs to expect callback(err, responses)
    var surveyId = surveyData['surveyId'];
    var userId = surveyData['userId'];
    logger.info("Getting user vote from database for surveyId", surveyId, "and user", userId);

    var queryString = 'SELECT a.id AS "answerId", COUNT(v.id) \
                       FROM survey AS s \
                           INNER JOIN question AS q ON s.id = q."surveyId" AND s.id = $1 \
                           INNER JOIN answer AS a ON q.id = a."questionId" \
                           LEFT JOIN vote AS v ON a.id = v."answerId"  AND v."userId" = $2 \
                       GROUP BY a.id \
                       ORDER BY a.id;';

    runQuery(queryString, [surveyId, userId])
        .then(function (results) {
            if(results.rowCount == 0) {
                // either there are simply no votes for this survey, or this survey ID is non-existent

                // check if survey exists
                return runQuery("SELECT * FROM survey WHERE id=$1", [surveyId])
                .then(function (res) {
                    if(res.rowCount == 0) {
                        // survey doesn't exist, throw 404
                        logger.error("Attempt to get user votes for non-existent survey ID");
                        var err = Error();
                        err['httpStatus'] = 404;
                        err['httpResponse'] = "404 Not Found";
                        err['friendlyName'] = "Non-existent survey ID";
                        throw err;
                    }
                    return results;
                });
            } else {
              return results;
            }
        })
        .then(function (results) {
            var ret = {};
            for (var r=0; r<results.rowCount; r++) {
              var answerId = results.rows[r].answerId;
              ret[answerId] = parseInt(results.rows[r].count);
            }
            logger.info("Got user votes from database for surveyId", surveyId);
            callback(null, ret);
            return;
        })
        .fail(function (error) {
            logger.error("Error getting user votes", error);
            callback(error);
            return;
        });
};


exports.getUserVotes = getUserVotes;
