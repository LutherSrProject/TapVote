var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");

function responses(req, response) {
    //Test this endpoint with curl http://localhost:8000/responses?surveyId=0
    logger.info("Request handler 'responses' was called.");
    data = req.query;
    if (!data['surveyId']) { //this can happen if the content-type isn't set correctly when you send raw JSON
        err = new Error()
        err["httpStatus"] = 400;
        err["httpResponse"] = "400 Bad Request";
        err["friendlyName"] = "JSON parse error";
        httpresponses.errorResponse(err, response);
        return;
    }

    logger.info("Incoming request for responses for: " + data['surveyId']);
    // TODO update with actual data (timestamp, uid, etc?)
    database.getResponses(data, function(err, results) {
        if (err) {
            err["httpStatus"] = 500;
            err["httpResponse"] = "500 Internal Server Error";
            if (!err["friendlyName"]) {
                err["friendlyName"] = "Error recording vote";
            }
            httpresponses.errorResponse(err, response);
            return;
        }
        else {
            logger.info("Returning survey data");
            httpresponses.successResponse(response, results);
            return;
        }
    });
}

exports.responses = responses;

