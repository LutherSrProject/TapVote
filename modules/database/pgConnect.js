var pg = require("pg"); // PostgreSQL client library
var database = require("../database");

var dbSessionProtocol = process.env.TAPVOTE_DATABASE_SESSION_PROTOCOL;
if (!dbSessionProtocol)
    dbSessionProtocol = database.dbProtocol;
var dbSessionUser = process.env.TAPVOTE_DATABASE_SESSION_USER; //suggested: nodepg
if (!dbSessionUser)
    dbSessionUser = database.dbUser;
var dbSessionPassword = process.env.TAPVOTE_DATABASE_SESSION_PASSWORD;
if (!dbSessionPassword)
    dbSessionPassword = database.dbPassword;
var dbSessionHost = process.env.TAPVOTE_DATABASE_SESSION_HOST;
if (!dbSessionHost)
    dbSessionHost = database.dbHost;
var dbSessionDatabase = process.env.TAPVOTE_DATABASE_SESSION_DATABASE;
if (!dbSessionDatabase)
    dbSessionDatabase = database.dbDatabase;

var sessionConnString = dbSessionProtocol + "://" + dbSessionUser + ":" + dbSessionPassword + "@" + dbSessionHost + "/" + dbSessionDatabase;

function pgConnect (callback) {
    pg.connect(sessionConnString,
        function (err, client, done) {
            if (err) {
                console.log(JSON.stringify(err));
            }
            if (client) {
                callback(client);
                done();
            }
        }
    );
};
exports.pgConnect = pgConnect;
