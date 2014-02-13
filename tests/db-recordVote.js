var Q = require("q");
var should = require('should');
var database = require('../modules/database');


describe("recordVote", function () {
    it("inserts a valid vote into the database", function(done) {
        database.recordVote({'answerId':1,'questionId':1}, function(err,results) {
            try {
                should.not.exist(err);
                // avoid polluting the DB with more test data
                database.deleteVote({'answerId':1, 'questionId':1});
                done();
            } catch(testerror) {
                done(testerror);
            }
        });
    });
    // TODO rewrite this test so that it tests an existant answerId that does not belong to the existant questionId
    it("inserts an invalid vote into the database", function(done) {
        database.recordVote({'answerId':0,'questionId':1},function(err,results) {
            try {
                should.exist(err,"expected to receive an error");
                done();
            } catch(testerror) {
                done(testerror);
            }
        });
    });
    it("inserts an invalid vote for an answer that doesn't exist into the database", function(done) {
        database.recordVote({'answerId':0,'questionId':1},function(err,results) {
            try {
                should.exist(err,"expected to receive an error");
                done();
            } catch (testerror) {
                done(testerror);
            }
        });
    });
});
