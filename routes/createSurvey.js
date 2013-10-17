var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");

function createSurvey(req, response) {
    //Test this endpoint with curl -d '{ "title":"\"Because clickers are SO 1999.\"", "questions": [{"question": "Which is best?", "answers": ["Puppies", "Cheese", "Joss Whedon", "Naps"]}],"password":"supersecretpassword" }' -H "Content-Type: application/json" http://localhost:8000/createSurvey
    logger.info("Request handler 'createSurvey' was called.");
    var requiredApiParameters = {
            "title":"string",
            "questions":"object",
            "password":"string"};
    data = req.body;
    if (Object.keys(data).length == 0) { //this can happen if the content-type isn't set correctly when you send raw JSON
        err = new Error();
        err["httpStatus"] = 400;
        err["httpResponse"] = "400 Bad Request";
        err["friendlyName"] = "Unable to parse request as POST body data. Send header Content-Type: application/json if you are submitting JSON";
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
    logger.info("Incoming survey: " + data['title']);
    // TODO update with actual data (timestamp, uid, etc?)
    database.createSurvey(data, function(err, results) {
        if (err) {
            err["httpStatus"] = 500;
            err["httpResponse"] = "500 Internal Server Error";
            if (!err["friendlyName"]) {
                err["friendlyName"] = "Error recording survey";
            }
            httpresponses.errorResponse(err, response);
            return;
        }
        else {
            logger.info("Logged survey to database");
            httpresponses.successResponse(response, results);
            return;
        }
    });
}

exports.createSurvey = createSurvey;

