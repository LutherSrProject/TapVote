var pg = require("pg"); // PostgreSQL client library

// this should be used anytime we need to connect to the DB
var CONNSTRING = "postgres://postgres:wearetapvote@localhost/tapvotetest";


var recordVote = function(voteData, callback) {
    // voteData = {'vote':'a'}
    runQuery("INSERT INTO test(vote) VALUES($1)", [voteData['vote']], callback)
}

// local scope, don't export
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


exports.recordVote = recordVote;
