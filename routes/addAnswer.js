var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");
var endpoint = require("../modules/endpoint");

//Test this endpoint with
//curl -d '{"answers": [{"questionId":2, "value":"apples"}]}' -H "Content-Type: application/json" http://localhost:8000/addAnswers

function addAnswer(){
    var apiOptions = {};
    
    //The name of this route:
    apiOptions.endpointName = "addAnswer";
    
    //Indicates the required API parameters and their basic expected types.
    apiOptions.requiredApiParameters = {
            "questionId":"number",
            "value":"string"
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
        database.addAnswer(data, function(err, results) {
            if (err) {
                if (!err["httpStatus"]) {
                    err["httpStatus"] = 500;
                }

                if(!err["httpResponse"]) {
                    err["httpResponse"] = "500 Internal Server Error";
                }

                if (!err["friendlyName"]) {
                    err["friendlyName"] = "Error adding new answer";
                }
                httpresponses.errorResponse(err, response);
                return;
            }
            else {
                logger.info("Added new answer to database");
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

exports.addAnswer = addAnswer;
