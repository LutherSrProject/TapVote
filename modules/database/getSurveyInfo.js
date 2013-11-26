var Q = require("q");
var runQuery = require("./runQuery").runQuery;


var getSurveyInfo = function(surveyData, callback) {
    // surveyData = {'surveyId':34}
    var surveyId = surveyData['surveyId'];

    // See http://stackoverflow.com/a/19439766/1576908 for more info on what is going on here

    // get questions for surveyId
    runQuery('SELECT * FROM question WHERE "surveyId"=$1', [surveyId])
    .then(function (results) {
        var questions = results.rows;
        return Q.all(questions.map(function (question) { // map each question into a function to get its answers
            return runQuery('SELECT * FROM answer WHERE "questionId"=$1', [question.id])
            .then(function (answers) {
                question.answers = answers.rows; // annotate each question w/ the list of answers
                return question;
            })
            .thenResolve(question);
        }))
    })
    .then(function (results) {
        // results is a list of questions each annotated with a list of answers.
        // Still need to do a query to get survey info from DB (mainly the survey title).
        return runQuery('SELECT * FROM survey WHERE id=$1', [surveyId])
        .then(function (survey) {
            if (survey.rowCount == 0) {
                logger.error("Attempted to get survey info for non-existent survey ID");
                var err = Error();
                err['httpStatus'] = 404;
                err['httpResponse'] = '404 Not Found';
                err['friendlyName'] = "Non-existent survey ID";
                throw err;
            }
            var title = survey.rows[0].title;
            return {title: title, questions: results};
        });
    })
    .then(function (res) {
        logger.info("Got survey info from database for surveyId", surveyId);
        callback(null, res);
        return;
    })
    .fail(function (error) {
        logger.error("Error getting survey info from database: ", error);
        callback(error);
        return;
    });
};


exports.getSurveyInfo = getSurveyInfo;

