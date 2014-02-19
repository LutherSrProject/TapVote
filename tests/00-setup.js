
var sys = require('sys');
var exec = require('child_process').exec;

beforeEach(function (done) {
    // reset the contents of the database
    exec("db-migrate down 20131029 -e test && db-migrate up -e test", function (error, stdout, stderr) {
        done();
    });
});
