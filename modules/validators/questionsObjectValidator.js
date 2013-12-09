var generalApiValidator = require("./generalApiValidator");

function singleQuestionValidator(){
    var validateOptions = {};
    
    //Indicates the required API parameters and their basic expected types.
    validateOptions.requiredApiParameters = {
            "question":"string",
            "type":"string"
    };
    //Indicates the optional API parameters and their basic expected types.
    validateOptions.optionalApiParameters = {
            "answers":"object"
    };
    
    //Provides additional validation functions after the basic check on required parameters. 
    //If a parameter is listed in this object, it MUST validate successfully and return true if provided in the request.
    //In the case of a problem, return false or throw an error.
    validateOptions.validators = {
            "type": function(type) {
                var availableTypes = ["MCSR","MCMR","MCRANK","FR"];
                if (availableTypes.indexOf(type) > -1) {
                    return true;
                } else {
                    err = new Error();
                    err["httpStatus"] = 400;
                    err["httpResponse"] = "400 Bad Request";
                    err["friendlyName"] = '"' + type + '" is not a valid question type';
                    throw err;
                }
                return false; //should never hit this...
            },
            "answers": function(answers) {
                for (var i = 0; i < answers.length; i++) {
                    if (typeof answers[i] != "string") {
                        err = new Error();
                        err["httpStatus"] = 400;
                        err["httpResponse"] = "400 Bad Request";
                        err["friendlyName"] =
                            'Provided answer "' + answers[i] + '" was not of the expected type. ' +
                            'Got "' + typeof answers[i] + '", ' +
                            'expected "string".';
                        throw err;
                    }
                }
                return true;
            }
    };
    
    var apiObject = new generalApiValidator.GeneralApiValidator(validateOptions);
    return function() {  
        (apiObject.handle).apply(apiObject, arguments);  
    }; //return the handler function for the validator
}



function QuestionsObjectValidator() {
    this.singleQuestionValidator = singleQuestionValidator();
}

QuestionsObjectValidator.prototype.handle = function(questions){
    for (var i = 0; i < questions.length; i++) {
        this.singleQuestionValidator(questions[i]);
    }
    return true;
};

function questionsObjectValidator() {
    var apiObject = new QuestionsObjectValidator();
    return function() {  
        (apiObject.handle).apply(apiObject, arguments);  
    };
}

exports.questionsObjectValidator = questionsObjectValidator;