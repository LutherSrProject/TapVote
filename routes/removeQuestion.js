var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");
var endpoint = require("../modules/endpoint");

//Test this endpoint with
//curl -d '{"questionId": 3}' -H "Content-Type: application/json" http://localhost:8000/removeQuestion

function removeQuestion(){
    var apiOptions = {};
    
    //The name of this route:
    apiOptions.endpointName = "removeQuestion";
    
    //Indicates the required API parameters and their basic expected types.
    apiOptions.requiredApiParameters = {
            "questionId":"number"
    };
    //Indicates the optional API parameters and their basic expected types.
    apiOptions.optionalApiParameters = {
            "surveyId":"number",
            "password":"string"
    };
    
    //Provides additional validation functions after the basic check on required parameters. 
    //If a parameter is listed in this object, it MUST validate successfully and return true if provided in the request.
    //In the case of a problem, return false or throw an error.
    apiOptions.validators = {};
    
    //Function to execute if validation tests are successful.
    apiOptions.conclusion = function(data, response) {
        logger.info("Received request to remove question with id: " + data['questionId']);
        // TODO update with actual data (timestamp, uid, etc?)
        console.log(data);
        database.removeQuestion(data, function(err, results) {
            if (err) {
                if (!err["httpStatus"]) {
                    err["httpStatus"] = 500;
                }

                if(!err["httpResponse"]) {
                    err["httpResponse"] = "500 Internal Server Error";
                }

                if (!err["friendlyName"]) {
                    err["friendlyName"] = "Error removing question";
                }
                httpresponses.errorResponse(err, response);
                return;
            }
            else {
                logger.info("Removed question from database");
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

exports.removeQuestion = removeQuestion;
