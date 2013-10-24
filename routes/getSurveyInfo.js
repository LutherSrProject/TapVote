var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");

function getSurveyInfo(req, response) {
    //Test this endpoint with curl http://localhost:8000/getSurveyInfo?surveyId=1
    logger.info("Request handler 'getSurveyInfo' was called.");
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
            err["friendlyName"] =
                   'Required parameter "' + param + '" was not of the expected type. ' +
                   'Got "' + typeof data[param] + '", ' +
                   'expected "' + requiredApiParameters[param] + '".';

            httpresponses.errorResponse(err, response);
            return;
        }
    }
    logger.info("Incoming request for survey info for: " + data['surveyId']);
    var dataForDB = {};
    dataForDB['surveyId'] = parseInt(data['surveyId']);
    database.getSurveyInfo(dataForDB, function(err, results) {
        if (err) {
            err["httpStatus"] = 500;
            err["httpResponse"] = "500 Internal Server Error";
            if (!err["friendlyName"]) {
                err["friendlyName"] = "Error retrieving survey info";
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

exports.getSurveyInfo = getSurveyInfo;

