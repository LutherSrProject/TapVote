var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");

function vote(req, response) {
    //Test this endpoint with curl -d '{"vote":"a", "surveyId":"test"}' -H "Content-Type: application/json" http://localhost:8000/vote
    logger.info("Request handler 'vote' was called.");
    data = req.body;
    if (!data['vote']) { //this can happen if the content-type isn't set correctly when you send raw JSON
        err = new Error();
        err["httpStatus"] = 400;
        err["httpResponse"] = "400 Bad Request";
        err["friendlyName"] = "JSON parse error";
        httpresponses.errorResponse(err, response);
        return;
    }

    logger.info("Incoming vote: " + data['vote']);
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

