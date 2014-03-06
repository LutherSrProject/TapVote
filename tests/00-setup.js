
var sys = require('sys');
var exec = require('child_process').exec;

beforeEach(function (done) {
    // reset the contents of the database
    this.timeout(8000);
    var command = "db-migrate down 20131029 -e test && " +
                  "db-migrate up -e test";
    exec(command, function (error, stdout, stderr) {
        if (stderr)
            console.log(stderr);
        done();
    });
});
