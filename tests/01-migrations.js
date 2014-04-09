
var sys = require('sys');
var exec = require('child_process').exec;
var should = require('should');

describe("db-migrate", function(){
    it("trys to migrate down to nothing, then migrates up to latest", function(done) {
        this.timeout(8000);
        var command = "db-migrate down 20131029 -e test && " +
                      "db-migrate up -e test";
        exec(command, function (error, stdout, stderr) {
            stderr.should.equal("");
            done();
        });
    });
});

