
function GeneralApiValidator(apiOptions) {
    this.requiredApiParameters = apiOptions.requiredApiParameters;
    this.optionalApiParameters = apiOptions.optionalApiParameters;
    this.validators = apiOptions.validators;
}

GeneralApiValidator.prototype.handle = function(data){
    
    var param = "";
    for (param in this.requiredApiParameters) {
        if (data[param] === undefined) {
            var err = new Error();
            err["httpStatus"] = 400;
            err["httpResponse"] = "400 Bad Request";
            err["friendlyName"] = 'Required parameter "' + param + '" was not provided.';
            throw err;
        } else if (typeof data[param] != this.requiredApiParameters[param]) {
            var err = new Error();
            err["httpStatus"] = 400;
            err["httpResponse"] = "400 Bad Request";
            err["friendlyName"] =
                    'Required parameter "' + param + '" was not of the expected type. ' +
                    'Got "' + typeof data[param] + '", ' +
                    'expected "' + this.requiredApiParameters[param] + '".';
            throw err;
        }
    }
    for (param in this.optionalApiParameters) {
        if (data[param] !== undefined && typeof data[param] != this.optionalApiParameters[param]) {
            var err = new Error();
            err["httpStatus"] = 400;
            err["httpResponse"] = "400 Bad Request";
            err["friendlyName"] =
                    'Provided optional parameter "' + param + '" was not of the expected type. ' +
                    'Got "' + typeof data[param] + '", ' +
                    'expected "' + this.optionalApiParameters[param] + '".';
            throw err;
        }
    }
    for (param in this.validators) {
        try {
            if (data[param] !== undefined && (this.validators[param](data[param]) === false)) {
                //if the validator just returns false, throw a default error
                throw new Error("General failure");
            }
        } catch (err) {
            if (typeof err == "string") {
                err = new Error(err);
            }
            
            if (err["httpStatus"] === undefined) {
                err["httpStatus"] = 400;
            }

            if(err["httpResponse"] === undefined) {
                err["httpResponse"] = "400 Bad Request";
            }
            
            if (err["friendlyName"] === undefined) {
                var errorString = "";
                if (err.name !== undefined && err.message !== undefined) {
                    errorString = err.name + ": "+ err.message;
                }
                err["friendlyName"] = 'Provided parameter "' + param + '" failed vaidation. ' + errorString;
            }
            throw err;
        }
        
    }
    return;
};

function generalApiValidator(apiOptions) {
    var apiObject = new GeneralApiValidator(apiOptions);
    return function() {  
        (apiObject.handle).apply(apiObject, arguments);  
    };
}


exports.generalApiValidator = generalApiValidator;
exports.GeneralApiValidator = GeneralApiValidator;