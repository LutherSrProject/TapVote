var Q = require("q");
var runQuery = require("./runQuery").runQuery;


var getSurveyResults = function (surveyData, callback) {
    // surveyData = {'surveyId':34}
    // callback needs to expect callback(err, responses)
    var surveyId = surveyData['surveyId'];
    logger.info("Getting survey results from database for surveyId", surveyId);

    var queryString = 'SELECT a.id AS "answerId", COUNT(v.id) \
                       FROM survey AS s \
                           INNER JOIN question AS q ON s.id = q."surveyId" AND s.id = $1 \
                           INNER JOIN answer AS a ON q.id = a."questionId" \
                           LEFT JOIN vote AS v ON a.id = v."answerId" \
                       GROUP BY a.id \
                       ORDER BY a.id;';

    runQuery(queryString, [surveyId])
        .then(function (results) {
            if(results.rowCount == 0) {
                // either there are simply no answers for this survey, or this survey ID is non-existent

                // check if survey exists
                return runQuery("SELECT * FROM survey WHERE id=$1", [surveyId])
                .then(function (res) {
                    if(res.rowCount == 0) {
                        // survey doesn't exist, throw 404
                        logger.error("Attempt to get survey results for non-existent survey ID");
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
            logger.info("Got survey results from database for surveyId", surveyId);
            var totalVotersQueryString = 'SELECT DISTINCT v."userId" \
                               FROM survey AS s \
                                   INNER JOIN question AS q ON s.id = q."surveyId" AND s.id = $1 \
                                   INNER JOIN answer AS a ON q.id = a."questionId" \
                                   INNER JOIN vote AS v ON a.id = v."answerId";';
            return runQuery(totalVotersQueryString, [surveyId])
                .then(function (tvres) {
                    logger.info("Got totalVoters from database for surveyId", surveyId);
                    ret["totalVoters"] = parseInt(tvres.rowCount);
                    return ret;
                });
        })
        .then(function (ret) {
            callback(null, ret);
            return;
        })
        .fail(function (error) {
            logger.error("Error getting survey results", error);
            callback(error);
            return;
        });
};


exports.getSurveyResults = getSurveyResults;
