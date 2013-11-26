var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    var queryString = "ALTER TABLE question " +
        "                  ADD COLUMN type text;" +
        "              UPDATE question SET type = 'MCSR' WHERE type IS NULL;";

    db.runSql(queryString, callback);
};

exports.down = function(db, callback) {
    var queryString = "ALTER TABLE question " +
        "                  DROP COLUMN type;";

    db.runSql(queryString, callback);
};
