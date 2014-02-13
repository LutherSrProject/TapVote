var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");
var endpoint = require("../modules/endpoint");
var questionsObjectValidator = require("../modules/validators/questionsObjectValidator");

//Test this endpoint with
//curl -d '{"answers": [{"questionId":2, "value":"apples"}]}' -H "Content-Type: application/json" http://localhost:8000/addAnswers

function addAnswers(){
    var apiOptions = {};
    
    //The name of this route:
    apiOptions.endpointName = "addAnswers";
    
    //Indicates the required API parameters and their basic expected types.
    apiOptions.requiredApiParameters = {
            "answers":"object"
    };
    //Indicates the optional API parameters and their basic expected types.
    apiOptions.optionalApiParameters = {
            "surveyId":"number"
    };
    
    //Provides additional validation functions after the basic check on required parameters. 
    //If a parameter is listed in this object, it MUST validate successfully and return true if provided in the request.
    //In the case of a problem, return false or throw an error.
    apiOptions.validators = {
    };
    
    //Function to execute if validation tests are successful.
    apiOptions.conclusion = function(data, response) {
        logger.info("Adding new answers.");
        console.log(data);
        database.addAnswers(data, function(err, results) {
            if (err) {
                if (!err["httpStatus"]) {
                    err["httpStatus"] = 500;
                }

                if(!err["httpResponse"]) {
                    err["httpResponse"] = "500 Internal Server Error";
                }

                if (!err["friendlyName"]) {
                    err["friendlyName"] = "Error adding new answers";
                }
                httpresponses.errorResponse(err, response);
                return;
            }
            else {
                logger.info("Added new answers to database");
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

exports.addAnswers = addAnswers;
