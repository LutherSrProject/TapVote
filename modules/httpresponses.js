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

exports.errorResponse = errorResponse;
exports.successResponse = successResponse;
