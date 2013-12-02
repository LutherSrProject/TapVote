var Q = require("q");
var pg = require("pg"); // PostgreSQL client library


// this should be used anytime we need to connect to the DB
var CONNSTRING;
var dbPassword = process.env.TAPVOTE_DATABASE_PASSWORD;

// if it's set in the environment, use that password. Otherwise, use "wearetapvote"
if (dbPassword)
    CONNSTRING = "postgres://postgres:" + dbPassword + "@localhost/tapvotetest";
else
    CONNSTRING = "postgres://postgres:wearetapvote@localhost/tapvotetest";


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


exports.runQuery = runQuery;
