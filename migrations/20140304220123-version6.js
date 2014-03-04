var dbm = require('db-migrate');
var fs = require('fs');
var type = dbm.dataType;

exports.up = function(db, callback) {
    fs.readFile("./node_modules/connect-pg/lib/session_install.sql", function (error, data) {
        if (error) {
            console.log(error);
            throw new Error("Session installation is broken.");
        }

        data += "CREATE EXTENSION pgtap; SELECT correct_web()";
        db.runSql(data, callback)
    });

};

exports.down = function(db, callback) {
    db.runSql("SELECT web.clear_sessions(); DROP EXTENSION pgtap", callback);
};
