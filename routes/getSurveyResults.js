var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");
var endpoint = require("../modules/endpoint");

//Test this endpoint with curl http://localhost:8000/getSurveyResults?surveyId=1

function getSurveyResults(){
    var apiOptions = {};
    
    //The name of this route:
    apiOptions.endpointName = "getSurveyResults";
        
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
        logger.info("Incoming request for survey results for: " + data['surveyId']);
        var dataForDB = {};
        dataForDB['surveyId'] = parseInt(data['surveyId']);
        database.getSurveyResults(dataForDB, function(err, results) {
            if (err) {
                if (!err["httpStatus"])
                    err["httpStatus"] = 500;

                if(!err["httpResponse"])
                    err["httpResponse"] = "500 Internal Server Error";

                if (!err["friendlyName"])
                    err["friendlyName"] = "Error getting survey results";

                httpresponses.errorResponse(err, response);
                return;
            }
            else {
                logger.info("Returning survey results");
                httpresponses.successResponse(response, results);
                return;
            }
        });
    };
    
    var endpointObject = new endpoint.Endpoint(apiOptions)
    return function() {  
        (endpointObject.handle).apply(endpointObject, arguments);  
    }; //return the handler function for the endpoint
}

exports.getSurveyResults = getSurveyResults;
