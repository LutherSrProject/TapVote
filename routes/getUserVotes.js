var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");
var endpoint = require("../modules/endpoint");

//Test this endpoint with curl http://localhost:8000/getUserVotes?surveyId=1

function getUserVotes(){
    var apiOptions = {};
    
    //The name of this route:
    apiOptions.endpointName = "getUserVotes";
        
    //Indicates the required API parameters and their basic expected types.
    apiOptions.requiredApiParameters = {
            "surveyId":"string"};
    
    //Indicates the optional API parameters and their basic expected types.
    apiOptions.optionalApiParameters = {};
    
    //Provides additional validation functions after the basic check on required parameters. 
    //If a parameter is listed in this object, it MUST validate successfully and return true if provided in the request.
    //In the case of a problem, return false or throw an error.
    apiOptions.validators = {};
    
    //Function to execute if validation tests are successful.
    apiOptions.conclusion = function(data, response) {
        logger.info("Incoming request for user votes for: " + data['surveyId']);
        data['surveyId'] = parseInt(data['surveyId']);
        database.getUserVotes(data, function(err, results) {
            if (err) {
                if (!err["httpStatus"])
                    err["httpStatus"] = 500;

                if(!err["httpResponse"])
                    err["httpResponse"] = "500 Internal Server Error";

                if (!err["friendlyName"])
                    err["friendlyName"] = "Error getting user votes";

                httpresponses.errorResponse(err, response);
                return;
            }
            else {
                logger.info("Returning user votes");
                httpresponses.successResponse(response, results);
                return;
            }
        });
    };
    
    var endpointObject = new endpoint.Endpoint(apiOptions);
    return function() {  
        (endpointObject.handle).apply(endpointObject, arguments);  
    }; //return the handler function for the endpoint
}

exports.getUserVotes = getUserVotes;
