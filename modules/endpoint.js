var httpresponses = require("../modules/httpresponses");
var generalApiValidator = require("../modules/validators/generalApiValidator");

function Endpoint(apiOptions) {
    this.endpointName = apiOptions.endpointName;
    this.requiredApiParameters = apiOptions.requiredApiParameters;
    this.optionalApiParameters = apiOptions.optionalApiParameters;
    this.validators = apiOptions.validators;
    this.conclusion = apiOptions.conclusion;
    this.apiValidator = generalApiValidator.generalApiValidator(apiOptions);
}

Endpoint.prototype.handle = function(req, response){
    logger.info("Request handler '" + this.endpointName + "' was called.");
    var data = req.body;
    if (Object.keys(data).length == 0) {
        data = req.query; //attempt to check GET parameters if there is no POST body
    }
    if (Object.keys(data).length == 0 || Object.keys(data)[0].substring(0,1)=="{") { //this can happen if the content-type isn't set correctly when you send raw JSON
        var err = new Error();
        err["httpStatus"] = 400;
        err["httpResponse"] = "400 Bad Request";
        err["friendlyName"] = "Unable to parse request as GET parameters or POST body data. Send header Content-Type: application/json if you are submitting JSON";
        httpresponses.errorResponse(err, response);
        return;
    }
    try {
        this.apiValidator(data);
    } catch (err) {
        httpresponses.errorResponse(err, response);
        return;
    }
    data.userId = req.virtualSession.uuid;
    return this.conclusion(data, response);
};

exports.Endpoint = Endpoint;
    