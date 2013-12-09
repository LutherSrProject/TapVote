var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");
var endpoint = require("../modules/endpoint");
var questionsObjectValidator = require("../modules/validators/questionsObjectValidator");

//Test this endpoint with
//curl -d '{ "title":"\"Because clickers are SO 1999.\"", "questions": [{"question": "Which is best?", "type":"MCSR", "answers": ["Puppies", "Cheese", "Joss Whedon", "Naps"]}],"password":"supersecretpassword" }' -H "Content-Type: application/json" http://localhost:8000/createSurvey

function createSurvey(){
    var apiOptions = {};
    
    //The name of this route:
    apiOptions.endpointName = "createSurvey";
    
    //Indicates the required API parameters and their basic expected types.
    apiOptions.requiredApiParameters = {
            "title":"string",
            "password":"string"
    };
    //Indicates the optional API parameters and their basic expected types.
    apiOptions.optionalApiParameters = {
            "questions":"object"
    };
    
    //Provides additional validation functions after the basic check on required parameters. 
    //If a parameter is listed in this object, it MUST validate successfully and return true if provided in the request.
    //In the case of a problem, return false or throw an error.
    apiOptions.validators = {
            "questions": new questionsObjectValidator.questionsObjectValidator()
    };
    
    //Function to execute if validation tests are successful.
    apiOptions.conclusion = function(data, response) {
        logger.info("Incoming survey: " + data['title']);
        // TODO update with actual data (timestamp, uid, etc?)
        console.log(data);
        database.createSurvey(data, function(err, results) {
            if (err) {
                if (!err["httpStatus"]) {
                    err["httpStatus"] = 500;
                }

                if(!err["httpResponse"]) {
                    err["httpResponse"] = "500 Internal Server Error";
                }

                if (!err["friendlyName"]) {
                    err["friendlyName"] = "Error recording survey";
                }
                httpresponses.errorResponse(err, response);
                return;
            }
            else {
                logger.info("Logged survey to database");
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

exports.createSurvey = createSurvey;
