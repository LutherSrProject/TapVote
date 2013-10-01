var pg = require("pg"); // PostgreSQL client library

// this should be used anytime we need to connect to the DB
var CONNSTRING = "postgres://postgres:wearetapvote@localhost/tapvotetest";


var recordVote = function(voteData, callback) {
    // voteData = {'vote':'a', 'surveyId':'xjffe'}
    runQuery("INSERT INTO test(vote) VALUES($1)", [voteData['vote']], callback)
}


var getResponses = function(surveyData, callback) {
    // surveyData = {'surveyId':'xxjfe'}
    // callback needs to expect callback(err, responses) where 
    // responses = {'a':20, 'b':15}
    //
    callback(null, {'a':20, 'b':15, 'c':34});
    return;
}

var createSurvey = function(surveyData, callback) {
    // surveyData = { 'title':'"Because clickers are SO 1999."', 
    //                'questions': [{'question': 'Which is best?', 'answers': ["Puppies", "Cheese", "Joss Whedon", "Naps"]}],
    //                'password':'supersecretpassword' }
    //
    // callback(err, result), where 
    // result = {'surveyId':'xxx'}
    callback(null, {'surveryId':'f43s3'});
    return;
}

exports.recordVote = recordVote;
exports.getResponses = getResponses;
exports.createSurvey = createSurvey;

// ==================================================================================================
// local scope, don't export
// ==================================================================================================


var runQuery = function(queryString, values, callback) {
    pg.connect(CONNSTRING, function(err, client, done) {
        if (err) {
            err["friendlyName"] = "Database connection error";
            console.log("Database connection error!", err)
            callback(err);
            return;
        }

        else {
            client.query(queryString, values, function(err, results) {
                done(); // called to release the connection client into the pool
                if (err) {
                    err["friendlyName"] = "Query error";
                    console.log("Query error!", err)
                    callback(err);
                    return;
                }
                else {
                    callback(err, results);
                    return;
                }
            });
        }
    });
}

