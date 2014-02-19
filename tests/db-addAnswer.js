var Q = require("q");
var should = require('should');
var database = require('../modules/database-test');

describe("addAnswer", function(){
    it("inserts a new answer into the database for an already existing question", function(done) {
        database.addAnswer({"questionId":1, "value":"new answer"}, function(err,results) {
            try {
                should.not.exist(err);
                done();
            } catch(testerror) {
                done(testerror);
            }
        });
    });
    it("tries to insert an answer into the database for a non-existent question", function(done) {
        database.addAnswer({"questionId":0, "value":"new answer"}, function(err,results) {
            try {
                should.exist(err, "expected to receive an error");
                done();
            } catch(testerror) {
                done(testerror);
            }
        });
    });

});

