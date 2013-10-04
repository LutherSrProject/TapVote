var pg = require("pg"); // PostgreSQL client library
var Q = require("q");

// this should be used anytime we need to connect to the DB
var CONNSTRING = "postgres://postgres:wearetapvote@localhost/tapvotetest";


var recordVote = function (voteData, callback) {
    // voteData = {'vote':'a', 'surveyId':'xjffe'}
    runQuery("INSERT INTO vote(surveyId, answerId) VALUES($1, $2)", [voteData['vote'], voteData['surveyId']])
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

var getResponses = function (surveyData, callback) {
    // surveyData = {'surveyId':'xxjfe'}
    // callback needs to expect callback(err, responses) where 
    // responses = {'a':20, 'b':15}
    //
    callback(null, {'a': 20, 'b': 15, 'c': 34});
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
        // insert the new survey (return the survey ID)
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
                    runQuery("INSERT INTO answer(questionid, value) VALUES($1, $2) RETURNING *", [qid, answer])
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
exports.getResponses = getResponses;
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

