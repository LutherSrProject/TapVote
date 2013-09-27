var exec = require("child_process").exec;
var database = require("./database");

function index(response, postData) {
    console.log("[INFO] Request handler 'index' was called.");
    exec("ls -lah", function (error, stdout, stderr) {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(stdout);
        response.end();
    });
}

function vote(response, postData) {
    //Test this endpoint with curl -d '{"vote": "a"}' -H "Content-Type: application/json" http://localhost:8000/vote
    console.log("[INFO] Request handler 'vote' was called.");

    try {
        data = JSON.parse(postData);
    } catch (err) {
        err["httpStatus"] = 400;
        err["httpResponse"] = "400 Bad Request";
        err["friendlyName"] = "JSON parse error";
        errorResponse(err, response);
        return;
    }

    console.log("[INFO] Incoming vote: " + data['vote']);
    // TODO update with actual data (timestamp, uid, etc?)
    database.recordVote(postData, function(err, results) {
        if (err) {
            err["httpStatus"] = 500;
            err["httpResponse"] = "500 Internal Server Error";
            if (!err["friendlyName"]) {
                err["friendlyName"] = "Error recording vote";
            }
            errorResponse(err, response);
            return;
        }
        else {
            console.log("[INFO] Logged vote to database");
            successResponse(response);
            return;
        }
    });
}


function errorResponse(err, response) {
    message = {'status':'error', 'message':err['friendlyName']};

    response.writeHead(err["httpStatus"], {"Content-Type": "application/json"});
    response.write(err["httpResponse"] + "\n");
    response.write(JSON.stringify(message) + "\n");
    response.end();

    console.log("[ERROR]", err)
}

function successResponse(response) {
    message = {'status':'success'};

    response.writeHead(200, {"Content-Type": "application/json"});
    response.write("200 OK" + "\n");
    response.write(JSON.stringify(message) + "\n");
    response.end();
}


exports.index = index;
exports.vote = vote;

