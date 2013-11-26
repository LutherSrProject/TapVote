var Q = require("q");
var runQuery = require("./runQuery").runQuery;


var createSurvey = function (surveyData, callback) {
    // result = {'surveyId':'xxx'}
    var title = surveyData['title'];
    var questions = surveyData['questions'];
    var password = surveyData['password'];

    logger.info("Inserting new survey into database...");
    runQuery('INSERT INTO survey(title, password) VALUES($1, $2) RETURNING *', [title, password])
    .then(function (result) {
        // insert the new survey (return the survey ID to use in inserting questions)
        logger.info("Inserted survey. New survey ID is", result.rows[0].id);
        return result.rows[0].id;
    })
    .then(function (sid) {
        // insert all the questions for this survey
        if(questions) {
            Q.all(questions.map(function (question) {
                var value = question["question"];
                var type = question["type"];
                var answers = question["answers"];

                return runQuery("INSERT INTO question(\"surveyId\", value, type) VALUES($1, $2, $3) RETURNING *", [sid, value, type])
                .then(function (results) {
                    var questionId = results.rows[0].id;
                    return Q.all(answers.map(function (answer) {
                        return runQuery("INSERT INTO answer(\"questionId\", value) VALUES($1, $2)", [questionId, answer])
                    }))
                    .thenResolve();
                });
            }));

        }
        return sid;
    })
    .then(function (surveyId) {
        logger.info("All questions and answers inserted");
        callback(null, {"surveyId": surveyId});
        return;
    })
    .fail(function (error) {
        logger.error("Error creating survey.", error);
        callback(error);
        return;
    })
};


exports.createSurvey = createSurvey;
