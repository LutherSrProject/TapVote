var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");
var endpoint = require("../modules/endpoint");

// Test this endpoint with
// curl -d '{"answerId":5, "questionId":5}' -H "Content-Type: application/json" http://localhost:8000/deVote

function deVote(){
    var apiOptions = {};
    
    //The name of this route:
    apiOptions.endpointName = "deVote";
        
    //Indicates the required API parameters and their basic expected types.
    apiOptions.requiredApiParameters = {
            "answerId":"number",
            "questionId":"number"};
    //Indicates the optional API parameters and their basic expected types.
    apiOptions.optionalApiParameters = {
            "surveyId":"number"};
    
    //Provides additional validation functions after the basic check on required parameters. 
    //If a parameter is listed in this object, it MUST validate successfully and return true if provided in the request.
    //In the case of a problem, return false or throw an error.
    apiOptions.validators = {};
    
    //Function to execute if validation tests are successful.
    apiOptions.conclusion = function(data, response) {
        logger.info("Incoming deVote: " + data);
        // TODO update with actual data (timestamp, uid, etc?)
        database.deleteVote(data, function(err, results) {
            if (err) {
                if (!err["httpStatus"])
                    err["httpStatus"] = 500;

                if(!err["httpResponse"])
                    err["httpResponse"] = "500 Internal Server Error";

                if (!err["friendlyName"])
                    err["friendlyName"] = "Error deleting vote";

                httpresponses.errorResponse(err, response);
                return;
            }
            else {
                logger.info("Deleted vote from database");
                httpresponses.successResponse(response);
                return;
            }
        });
    };
    
    var endpointObject = new endpoint.Endpoint(apiOptions);
    return function() {  
        (endpointObject.handle).apply(endpointObject, arguments);  
    }; //return the handler function for the endpoint
}

exports.deVote = deVote;
