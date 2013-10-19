var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");

function getSurveyResults(req, response) {
    //Test this endpoint with curl http://localhost:8000/getSurveyResults?surveyId=0
    logger.info("Request handler 'getSurveyResults' was called.");
    var requiredApiParameters = {
            "surveyId":"string"};
    data = req.query;
    if (Object.keys(data).length == 0) { //this can happen if the content-type isn't set correctly when you send raw JSON
        err = new Error();
        err["httpStatus"] = 400;
        err["httpResponse"] = "400 Bad Request";
        err["friendlyName"] = "Unable to parse request as GET parameters.";
        httpresponses.errorResponse(err, response);
        return;
    }
    var param = "";
    for (param in requiredApiParameters) {
        if (data[param] === undefined) {
            err = new Error();
            err["httpStatus"] = 400;
            err["httpResponse"] = "400 Bad Request";
            err["friendlyName"] = 'Required parameter "' + param + '" was not provided.';
            httpresponses.errorResponse(err, response);
            return;
        } else if (typeof data[param] != requiredApiParameters[param]) {
            err = new Error();
            err["httpStatus"] = 400;
            err["httpResponse"] = "400 Bad Request";
            err["friendlyName"] = 'Required parameter "' + param + '" was not of the expected type. Got "' + typeof data[param] + '", expected "' + requiredApiParameters[param] + '".';
            httpresponses.errorResponse(err, response);
            return;
        }
    }
    logger.info("Incoming request for survey results for: " + data['surveyId']);
    var dataForDB = {};
    dataForDB['surveyId'] = parseInt(data['surveyId']);
    database.getSurveyResults(dataForDB, function(err, results) {
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

