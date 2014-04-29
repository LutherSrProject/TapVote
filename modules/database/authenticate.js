var Q = require("q");
var runQuery = require("./runQuery").runQuery;

const UNAUTHEDUSER = 0;
const AUTHEDUSER = 1;
const AUTHEDEDITOR = 2;
const AUTHEDOWNER = 3;

var authenticate = function(data, callback) {
    
    if (data.surveyAuth !== undefined && data.surveyAuth.surveyId !== undefined) {
        var surveyId = data.surveyAuth['surveyId'];
        if (data.surveyAuth.editPassword !== undefined) {
            var providedEditPassword = data.surveyAuth['editPassword'];
            runQuery('SELECT * FROM survey WHERE id=$1', [surveyId])
            .then(function (survey) {
                if (survey.rowCount == 0) {
                    logger.error("Attempted to authenticate to non-existent survey ID");
                    var err = Error();
                    err['httpStatus'] = 404;
                    err['httpResponse'] = '404 Not Found';
                    err['friendlyName'] = "Non-existent survey ID";
                    throw err;
                }
                var surveyPassword = survey.rows[0].password;
                return surveyPassword;
            })
            .then(function (surveyPassword) {
                if (surveyPassword == providedEditPassword || surveyPassword == "")
                {
                    logger.info("Authenticated for surveyId", surveyId);
                    data.surveyAuthStatus[surveyId] = AUTHEDEDITOR;
                } else {
                    logger.info("Failed authentication for surveyId", surveyId);
                    var err = Error();
                    err['httpStatus'] = 401;
                    err['httpResponse'] = '401 Unauthorized';
                    err['friendlyName'] = "Incorrect editPassword for survey";
                    throw err;
                }
                callback(null);
                return;
            })
            .fail(function (error) {
                logger.error("Error authenticating to survey: ", error);
                callback(error);
                return;
            });
        }

    }
};

exports.authenticate = authenticate;
