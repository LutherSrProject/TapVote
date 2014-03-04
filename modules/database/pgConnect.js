var pg = require("pg"); // PostgreSQL client library
var dbSetup = require("./dbConnSetup");

var sessionConnString = "postgres://" + dbSetup.dbSessionUser + ":" + dbSetup.dbSessionPassword + "@" + dbSetup.dbSessionHost + "/" + dbSetup.dbSessionDatabase;

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
