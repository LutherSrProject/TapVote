//Attach global variables
require('../modules/globals');

var Q = require("q");
var should = require('should');
var database = require('../modules/database-test');

describe("deleteVote", function () {
    it("deletes a valid vote from the database", function (done) {
        database.deleteVote({'answerId':1, 'questionId':1}, function (err, results) {
            try {
                should.not.exist(err);
                // re-add that vote - otherwise we can only run the unit test suite a few times
                database.recordVote({'answerId':1, 'questionId':1});
                done();
            } catch (testerror) {
                done(testerror);
            }
        })
    });
    it("deletes an invalid vote from the database", function (done) {
        database.deleteVote({'answerId':1, 'questionId':2}, function (err, results) {
            try {
                should.exist(err, "expected to receive an error");
                done();
            } catch (testerror) {
                done(testerror);
            }
        })
    });
    it("deletes an invalid vote for an answer that doesn't exist from the database", function (done) {
        database.deleteVote({'answerId':0, 'questionId':2}, function (err, results) {
            try {
                should.exist(err, "expected to receive an error");
                done();
            } catch (testerror) {
                done(testerror);
            }
        })
    })
});
