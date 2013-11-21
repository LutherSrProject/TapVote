function errorResponse(err, response) {
    if (err === undefined) {
        err = new Error();
    }
    
    if (!err["httpStatus"]) {
        err["httpStatus"] = 500;
    }

    if(!err["httpResponse"]) {
        err["httpResponse"] = "500 Internal Server Error";
    }

    if (!err["friendlyName"]) {
        err["friendlyName"] = "Internal Server Error";
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
