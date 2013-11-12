var database = require("../modules/database");
var httpresponses = require("../modules/httpresponses");
var endpoint = require("../modules/endpoint");

function example(){
    var apiOptions = {};
    
    //The name of this route:
    apiOptions.endpointName = "example";
        
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
    apiOptions.validators = {
            "goodOptionalParameter": function(value) {return true;},
            "badOptionalParameter": function(value) {
                err = new Error();
                err["httpStatus"] = 400;
                err["httpResponse"] = "400 Bad Request";
                err["friendlyName"] = 'To put it in a "friendly" manner, you dun goofed.';
                throw err;
            },
            "reallyBadOptionalParameter": function(value) {return false;}
    };
    
    //Function to execute if validation tests are successful.
    apiOptions.conclusion = function(data, response) {
        logger.info("Incoming vote: " + data);
        // TODO update with actual data (timestamp, uid, etc?)
        database.recordVote(data, function(err, results) {
            if (err) {
                if (!err["httpStatus"])
                    err["httpStatus"] = 500;

                if(!err["httpResponse"])
                    err["httpResponse"] = "500 Internal Server Error";

                if (!err["friendlyName"])
                    err["friendlyName"] = "Something broke with the database request";

                httpresponses.errorResponse(err, response);
                return;
            }
            else {
                logger.info("Logged vote to database");
                httpresponses.successResponse(response);
                return;
            }
        });
    };
    
    var endpointObject = new endpoint.Endpoint(apiOptions)
    return function() {  
        (endpointObject.handle).apply(endpointObject, arguments);  
    }; //return the handler function for the endpoint
}

exports.example = example;
