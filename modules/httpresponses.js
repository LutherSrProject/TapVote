function errorResponse(err, response) {
    if (err === undefined) {
        err = new Error();
    }
    
    if (typeof err == "string") {
        err = new Error(err);
    }
    
    if (err["httpStatus"] === undefined) {
        err["httpStatus"] = 500;
    }

    if(err["httpResponse"] === undefined) {
        err["httpResponse"] = "500 Internal Server Error";
    }

    if (err["friendlyName"] === undefined) {
        if (err.name !== undefined && err.message !== undefined) {
            err["friendlyName"] = err.name + ": "+ err.message;
        } else {
            err["friendlyName"] = "Internal Server Error";
        }
    }
    message = {'status':'error', 'message':err['friendlyName']};

    response.writeHead(err["httpStatus"], {"Content-Type": "application/json"});
    //response.write(err["httpResponse"] + "\n");
    response.write(JSON.stringify(message) + "\n");
    response.end();

    logger.error("HTTP error response sent", err)
}

function successResponse(response, results) {
    if (!results) {
        results = {'status':'success'};
    }
    
    message = JSON.stringify(results) + "\n";

    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(message);
    response.end();
}

exports.errorResponse = errorResponse;
exports.successResponse = successResponse;
