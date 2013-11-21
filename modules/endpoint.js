var httpresponses = require("../modules/httpresponses");

function Endpoint(apiOptions) {
    this.endpointName = apiOptions.endpointName;
    this.requiredApiParameters = apiOptions.requiredApiParameters;
    this.optionalApiParameters = apiOptions.optionalApiParameters;
    this.validators = apiOptions.validators;
    this.conclusion = apiOptions.conclusion;
}

Endpoint.prototype.handle = function(req, response){
    logger.info("Request handler '" + this.endpointName + "' was called.");
    var data = req.body;
    if (Object.keys(data).length == 0) {
        data = req.query; //attempt to check GET parameters if there is no POST body
    }
    if (Object.keys(data).length == 0) { //this can happen if the content-type isn't set correctly when you send raw JSON
        var err = new Error();
        err["httpStatus"] = 400;
        err["httpResponse"] = "400 Bad Request";
        err["friendlyName"] = "Unable to parse request as GET parameters or POST body data. Send header Content-Type: application/json if you are submitting JSON";
        httpresponses.errorResponse(err, response);
        return;
    }
    var param = "";
    for (param in this.requiredApiParameters) {
        if (data[param] === undefined) {
            var err = new Error();
            err["httpStatus"] = 400;
            err["httpResponse"] = "400 Bad Request";
            err["friendlyName"] = 'Required parameter "' + param + '" was not provided.';
            httpresponses.errorResponse(err, response);
            return;
        } else if (typeof data[param] != this.requiredApiParameters[param]) {
            var err = new Error();
            err["httpStatus"] = 400;
            err["httpResponse"] = "400 Bad Request";
            err["friendlyName"] =
                    'Required parameter "' + param + '" was not of the expected type. ' +
                    'Got "' + typeof data[param] + '", ' +
                    'expected "' + this.requiredApiParameters[param] + '".';
            httpresponses.errorResponse(err, response);
            return;
        }
    }
    for (param in this.optionalApiParameters) {
        if (data[param] !== undefined && typeof data[param] != this.optionalApiParameters[param]) {
            var err = new Error();
            err["httpStatus"] = 400;
            err["httpResponse"] = "400 Bad Request";
            err["friendlyName"] =
                    'Provided optional parameter "' + param + '" was not of the expected type. ' +
                    'Got "' + typeof data[param] + '", ' +
                    'expected "' + this.optionalApiParameters[param] + '".';
            httpresponses.errorResponse(err, response);
            return;
        }
    }
    return this.conclusion(data, response);
};

exports.Endpoint = Endpoint;
    