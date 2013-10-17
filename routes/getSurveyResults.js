var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");

function getSurveyResults(req, response) {
    //Test this endpoint with curl http://localhost:8000/getSurveyResults?surveyId=0
    logger.info("Request handler 'getSurveyResults' was called.");
    data = req.query;
    if (!data['surveyId']) { //this can happen if the content-type isn't set correctly when you send raw JSON
        err = new Error();
        err["httpStatus"] = 400;
        err["httpResponse"] = "400 Bad Request";
        err["friendlyName"] = "JSON parse error";
        httpresponses.errorResponse(err, response);
        return;
    }

    logger.info("Incoming request for survey results for: " + data['surveyId']);
    // TODO update with actual data (timestamp, uid, etc?)
    database.getSurveyResults(data, function(err, results) {
        if (err) {
            err["httpStatus"] = 500;
            err["httpResponse"] = "500 Internal Server Error";
            if (!err["friendlyName"]) {
                err["friendlyName"] = "Error retrieving survey results";
            }
            httpresponses.errorResponse(err, response);
            return;
        }
        else {
            logger.info("Returning survey results");
            httpresponses.successResponse(response, results);
            return;
        }
    });
}

exports.getSurveyResults = getSurveyResults;

