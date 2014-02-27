var pg = require("pg"); // PostgreSQL client library

function pgConnect (callback) {
    pg.connect(CONNSTRING,
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
