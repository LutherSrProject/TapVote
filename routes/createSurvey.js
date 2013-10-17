var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");

function createSurvey(req, response) {
    //Test this endpoint with curl -d '{ "title":"\"Because clickers are SO 1999.\"", "questions": [{"question": "Which is best?", "answers": ["Puppies", "Cheese", "Joss Whedon", "Naps"]}],"password":"supersecretpassword" }' -H "Content-Type: application/json" http://localhost:8000/createSurvey
    logger.info("Request handler 'createSurvey' was called.");
    data = req.body;
    if (!data['title']) { //this can happen if the content-type isn't set correctly when you send raw JSON
        err = new Error();
        err["httpStatus"] = 400;
        err["httpResponse"] = "400 Bad Request";
        err["friendlyName"] = "JSON parse error";
        httpresponses.errorResponse(err, response);
        return;
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

