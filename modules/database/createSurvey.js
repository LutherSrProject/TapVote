var Q = require("q");
var moment = require("moment");
var runQuery = require("./runQuery").runQuery;
var addQuestions = require("./addQuestions").addQuestions;

var createSurvey = function (surveyData, callback) {
    // result = {'surveyId':'xxx'}
    var title = surveyData['title'];
    var questions = surveyData['questions'];
    var password = surveyData['password'];

    // off-load validation to moment
    var start = moment.utc(surveyData['start'], 'YYYY-MM-DD HH:mm:ss');
    var finish = moment.utc(surveyData['finish'], 'YYYY-MM-DD HH:mm:ss');

    var queryString;
    var queryParams;
    if (start && finish) {
        queryString = 'INSERT INTO survey(title, password, start, finish) VALUES ($1, $2, $3, $4) RETURNING *';
        queryParams = [title, password, start.format(), finish.format()];
    } else if (!start && finish) {
        queryString = 'INSERT INTO survey(title, password, finish) VALUES ($1, $2, $3) RETURNING *';
        queryParams = [title, password, finish.format()];
    } else if (start && !finish){  // !finish
        queryString = 'INSERT INTO survey(title, password, start) VALUES ($1, $2, $3) RETURNING *';
        queryParams = [title, password, start.format()];
    } else {  // !start && !finish
        queryString = 'INSERT INTO survey(title, password) VALUES ($1, $2) RETURNING *';
        queryParams = [title, password];
    }

    logger.info("Inserting new survey into database...");
    runQuery(queryString, queryParams)
    .then(function (result) {
        // insert the new survey (return the survey ID to use in inserting questions)
        logger.info("Inserted survey. New survey ID is", result.rows[0].id);
        return result.rows[0].id;
    })
    .then(function (sid) {
        // insert all the questions for this survey (if any)

        // Client sends an empty list if there aren't any questions. However, we'd like to
        // preserve the ability to add a survey without the questions parameter being present at all
        if(questions  && !(questions.length == 0)) {
            return Q.nfcall(addQuestions, {"surveyId":sid, "questions":questions})
            .then(function () {
                 logger.info("All questions and answers inserted");
                 return sid;
            });
        }
        else {
            logger.warn("New survey has no questions");
            return sid;
        }
    })
    .then(function (surveyId) {
        logger.info("Finished creating survey.");
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
