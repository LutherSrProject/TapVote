var Q = require("q");
var should = require('should');
var database = require('../modules/database');

describe("addAnswers", function(){
    it("inserts a new answer into the database for an already existing question", function(done) {
        database.addAnswers({"answers": [{"questionId":1, "value":"new answer"}]}, function(err,results) {
            try {
                should.not.exist(err);
                done();
            } catch(testerror) {
                done(testerror);
            }
        });
    });
    it("inserts two new answers into the database for an already existing question", function(done) {
        database.addAnswers({"answers": [{"questionId":1, "value":"new answer"}, {"questionId":1, "value":"new answer 2"}]}, function(err,results) {
            try {
                should.not.exist(err);
                done();
            } catch(testerror) {
                done(testerror);
            }
        });
    });
    it("tries to insert an answer into the database for a non-existent question", function(done) {
        database.addAnswers({"answers": [{"questionId":0, "value":"new answer"}]}, function(err,results) {
            try {
                should.exist(err, "expected to receive an error");
                done();
            } catch(testerror) {
                done(testerror);
            }
        });
    });

});

