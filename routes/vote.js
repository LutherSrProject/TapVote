var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");

function vote(req, response) {
    //Test this endpoint with curl -d '{"answerId":5, "questionId":5}' -H "Content-Type: application/json" http://localhost:8000/vote
    logger.info("Request handler 'vote' was called.");
    var requiredApiParameters = {
            "answerId":"number",
            "questionId":"number"};
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
            err["friendlyName"] =
                    'Required parameter "' + param + '" was not of the expected type. ' +
                    'Got "' + typeof data[param] + '", ' +
                    'expected "' + requiredApiParameters[param] + '".';

            httpresponses.errorResponse(err, response);
            return;
        }
    }
    logger.info("Incoming vote: " + data);
    // TODO update with actual data (timestamp, uid, etc?)
    database.recordVote(data, function(err, results) {
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
            logger.info("Logged vote to database");
            httpresponses.successResponse(response);
            return;
        }
    });
}

exports.vote = vote;

