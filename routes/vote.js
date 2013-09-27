var database = require("../modules/database");
var responses = require("../modules/responses");

function vote(req, response) {
    //Test this endpoint with curl -d '{"vote": "a"}' -H "Content-Type: application/json" http://localhost:8000/vote
    console.log("[INFO] Request handler 'vote' was called.");
    data = req.body;
    if (!data['vote']) { //this can happen if the content-type isn't set correctly when you send raw JSON
        err = new Error()
        err["httpStatus"] = 400;
        err["httpResponse"] = "400 Bad Request";
        err["friendlyName"] = "JSON parse error";
        responses.errorResponse(err, response);
        return;
    }

    console.log("[INFO] Incoming vote: " + data['vote']);
    // TODO update with actual data (timestamp, uid, etc?)
    database.recordVote(data, function(err, results) {
        if (err) {
            err["httpStatus"] = 500;
            err["httpResponse"] = "500 Internal Server Error";
            if (!err["friendlyName"]) {
                err["friendlyName"] = "Error recording vote";
            }
            responses.errorResponse(err, response);
            return;
        }
        else {
            console.log("[INFO] Logged vote to database");
            responses.successResponse(response);
            return;
        }
    });
}

exports.vote = vote;

