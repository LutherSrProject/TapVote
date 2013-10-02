function errorResponse(err, response) {
    message = {'status':'error', 'message':err['friendlyName']};

    response.writeHead(err["httpStatus"], {"Content-Type": "application/json"});
    //response.write(err["httpResponse"] + "\n");
    response.write(JSON.stringify(message) + "\n");
    response.end();

    console.log("[ERROR]", err)
}

function successResponse(response, results) {
    if (!results) {
        results = {'status':'success'};
    }
    
    message = JSON.stringify(results) + "\n";

    response.writeHead(200, {"Content-Type": "application/json"});
    //response.write("200 OK" + "\n");
    response.write(message);
    response.end();
}

exports.errorResponse = errorResponse;
exports.successResponse = successResponse;
