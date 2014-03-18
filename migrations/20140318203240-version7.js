var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    var queryString = "ALTER TABLE vote" +
                      "    ADD COLUMN \"userId\" uuid;" +
                      "    UPDATE vote SET \"userId\" = '00000000-0000-0000-0000-000000000000' WHERE \"userId\" IS NULL;";

    db.runSql(queryString, callback);
};

exports.down = function(db, callback) {
    var queryString = "ALTER TABLE vote" +
                      "    DROP COLUMN \"userId\";"

    db.runSql(queryString, callback);
};
