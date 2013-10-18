var pg = require("pg"); // PostgreSQL client library
var Q = require("q");

// this should be used anytime we need to connect to the DB
var CONNSTRING = "postgres://postgres:wearetapvote@localhost/tapvotetest";


var recordVote = function (voteData, callback) {
    // voteData = {'answerId':5, 'questionId':5}
    runQuery("INSERT INTO vote(answerid, questionid) VALUES($1, $2)", [voteData['answerId'], voteData['questionId']])
    .then(function (results) {
              logger.info("Recorded vote in database.");
              callback(null, results);
              return;
    })
    .fail(function (error) {
              logger.error("Error logging vote to database.", error);
              callback(error);
              return;
    });
};

var getSurveyInfo = function(surveyData, callback) {
    // surveyData = {'surveyId':34}
    var res = { title: "A sweet survey",
                questions: [
                    { id:12,
                      title:"What is your favorite color",
                      answers: [
                          {id:45, value:"blue"},
                          {id:32, value:"red"}
                      ]
                    },
                    { id:14,
                      title:"What is your favorite food",
                      answers: [
                          {id:21, value:"pizza"},
                          {id:18, value:"cake"},
                          {id:12, value:"brains"}
                      ]
                    }
                ]
              };
    callback(null, res);
    return;
};

var getSurveyResults = function (surveyData, callback) {
    // surveyData = {'surveyId':34}
    // callback needs to expect callback(err, responses)
    logger.info("Getting survey results from database for surveyId", surveyData['surveyId']);
    var surveyId = surveyData['surveyId'];

    var queryString = "SELECT * FROM question, answer, vote WHERE question.surveyid =$1 AND ";

    callback(null, {1: 20, 2: 15, 3: 34}); // 1, 2, 3 are answer.id's associated with the surveyId, and 20.. is a count
    return;
};

var createSurvey = function (surveyData, callback) {
    // surveyData = { 'title':'"Because clickers are SO 1999."', 
    //                'questions': [{'question': 'Which is best?', 'answers': ["Puppies", "Cheese", "Joss Whedon", "Naps"]}],
    //                'password':'supersecretpassword' }
    //
    // callback(err, result), where 
    // result = {'surveyId':'xxx'}
    var title = surveyData['title'];
    var questions = surveyData['questions'];
    var password = surveyData['password'];

    logger.info("Inserting new survey into database...");
    runQuery("INSERT INTO survey(title, password) VALUES($1, $2) RETURNING *", [title, password])
    .then(function (result) {
        // insert the new survey (return the survey ID to use in inserting questions)
        logger.info("Inserted survey. New survey ID is", result.rows[0].id);
        return result.rows[0].id;
    })

    .then(function (sid) {
        // insert all the questions for this survey
        for (var q=0; q<questions.length; q++) {
            var question = questions[q];
            var value = question['question'];
            var answers = question['answers'];
            runQuery("INSERT INTO question(surveyid, value) VALUES($1, $2) RETURNING *", [sid, value])

            .then(function (result) {
                // insert all the answers for this question
                var qid = result.rows[0].id;
                for (var a=0; a<answers.length; a++) {
                    var answer = answers[a];
                    runQuery("INSERT INTO answer(questionid, value) VALUES($1, $2)", [qid, answer])
                }
            });
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


exports.recordVote = recordVote;
exports.getSurveyResults = getSurveyResults;
exports.getSurveyInfo = getSurveyInfo;
exports.createSurvey = createSurvey;


// ==================================================================================================
// local scope, don't export
// ==================================================================================================

var runQuery = function (queryString, values) {
    var deferred = Q.defer();
    pg.connect(CONNSTRING, function (err, client, done) {
        if (err) {
            err["friendlyName"] = "Database connection error";
            logger.error("Database connection error in runQuery", err);
            deferred.reject(err);
        }

        else {
            client.query(queryString, values, function (err, results) {
                done(); // called to release the connection client into the pool
                if (err) {
                    err["friendlyName"] = "Query error";
                    logger.error("Query error in runQuery", err);
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(results);
                }
            });
        }
    });
    return deferred.promise;
};

