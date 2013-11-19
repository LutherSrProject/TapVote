var pg = require("pg"); // PostgreSQL client library
var Q = require("q");

// this should be used anytime we need to connect to the DB
var CONNSTRING = "postgres://postgres:wearetapvote@localhost/tapvotetest";


var addQuestions = function(data, callback) {
    // { "surveyId":1,
    //   "questions": [
    //       { "question": "Which is best?",
    //         "answers": [
    //              "Puppies",
    //              "Cheese",
    //              "Joss Whedon",
    //              "Naps"
    //         ]
    //       }
    //   ],
    //   "password":"supersecretpassword" }
    var surveyId = data["surveyId"];
    var questions = data["questions"];

    Q.all(questions.map(function (question) {
        var value = question["question"];
        var answers = question["answers"];

        return runQuery("INSERT INTO question(surveyId, value) VALUES($1, $2) RETURNING *", [surveyId, value])
        .then(function (results) {
            var questionId = results.rows[0].id;
            answers.map(function (answer) {
                return runQuery("INSERT INTO answer(questionId, value) VALUES($1, $2)", [questionId, answer]);
            })
            .thenResolve();
        });
    }))
    .then(function (results) {
        callback(null, results);
    })
    .fail(function (error) {
        callback(error);
    });
};

var removeQuestion = function(data, callback) {
    // var data = {questionId: 2}
    var questionId = data['questionId'];

    runQuery("DELETE FROM question WHERE id=$1", [questionId])
    .then(function (results) {
        callback(null, results);
        return;
    })
    .fail(function (error) {
        callback(error);
        return;
    });
};

var recordVote = function (voteData, callback) {
    // voteData = {'answerId':5, 'questionId':5}

    // need to check that voteData['answerId'] has a questionId == voteData['questionId']
    runQuery('SELECT "questionId" FROM answer WHERE id=$1', [voteData['answerId']])
    .then(function (results) {
        var qid = results.rows[0].questionId;
        if(qid == voteData['questionId']) {
            return;
        } else {
            var err = Error();
            throw err;
        }
    })
    .then(function (results) {
        runQuery('INSERT INTO vote("answerId", "questionId") VALUES($1, $2)', [voteData['answerId'], voteData['questionId']])
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

    })
    .fail(function (error) {
        logger.error("Question doesn't have that answer as an option.", error);
        error['httpStatus'] = 400;
        error['httpResponse'] = '400 Bad Request';
        error['friendlyName'] = "questionId and answerId don't match";
        callback(error);
        return;
    });
};

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
        if(results.length == 0) {
            var err = Error();
            err['httpStatus'] = 404;
            err['httpResponse'] = '404 Not Found';
            err['friendlyName'] = "Non-existent survey ID";
            throw err;
        }
        return runQuery('SELECT * FROM survey WHERE id=$1', [surveyId])
        .then(function (survey) {
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

var getSurveyResults = function (surveyData, callback) {
    // surveyData = {'surveyId':34}
    // callback needs to expect callback(err, responses)
    var surveyId = surveyData['surveyId'];
    logger.info("Getting survey results from database for surveyId", surveyId);

    var queryString = 'SELECT v."answerId", COUNT(*) \
                       FROM survey AS s \
                           INNER JOIN question AS q ON s.id = q."surveyId" AND s.id = $1 \
                           INNER JOIN vote AS v ON q.id = v."questionId" \
                       GROUP BY v."answerId" \
                       ORDER BY v."answerId"';

    runQuery(queryString, [surveyId])
    .then(function (results) {
        var ret = {};

        logger.info(results); // TODO remove

        if(results.rowCount == 0) {
            // either there are simply no votes for this survey, or this survey ID is non-existent

            // check if survey exists
            runQuery("SELECT * FROM survey WHERE id=$1", [surveyId])
            .then(function (results) {
                if(results.rowCount == 0) {
                    // survey doesn't exist, throw 404
                    logger.error("Attempt to get survey results for non-existent survey ID");
                    var err = Error();
                    err['httpStatus'] = 404;
                    err['httpResponse'] = "404 Not Found";
                    err['friendlyName'] = "Non-existent survey ID";
                    throw err;
                }
            });

        }
        for (var r=0; r<results.rowCount; r++) {
            var answerId = results.rows[r].answerId;
            ret[answerId] = parseInt(results.rows[r].count);
        }
        logger.info("Got survey results from database for surveyId", surveyId);
        callback(null, ret);
        return;
    })
    .fail(function (error) {
        logger.error("Error getting survey results", error);
        callback(error);
        return;
    });
};

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
        for (var q=0; q<questions.length; q++) {
            var question = questions[q];
            var value = question['question'];
            var answers = question['answers'];
            runQuery('INSERT INTO question("surveyId", value) VALUES($1, $2) RETURNING *', [sid, value])

            .then(function (result) {
                // insert all the answers for this question
                var qid = result.rows[0].id;
                for (var a=0; a<answers.length; a++) {
                    var answer = answers[a];
                    runQuery('INSERT INTO answer("questionId", value) VALUES($1, $2)', [qid, answer])
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
exports.addQuestions = addQuestions;
exports.removeQuestion = removeQuestion;

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

