var dbm = require('db-migrate');
var moment = require('moment');
var type = dbm.dataType;

exports.up = function(db, callback) {
    var queryString = "ALTER TABLE survey" +
                      "    ADD COLUMN start timestamp DEFAULT ('" + moment.utc().format() + "')," +
                      "    ADD COLUMN finish timestamp DEFAULT '2300-01-01';";

    db.runSql(queryString, callback);
};

exports.down = function(db, callback) {
    var queryString = "ALTER TABLE survey" +
                      "    DROP COLUMN start," +
                      "    DROP COLUMN finish;";

    db.runSql(queryString, callback);
};
