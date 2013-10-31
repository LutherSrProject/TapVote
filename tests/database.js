//Attach global variables
require('../modules/globals');

var should = require('should');

var database = require('../modules/database');
describe("Database", function(){
    describe("recordVote", function(){
        it("inserts a valid vote into the database", function(done) {
            database.recordVote({'answerId':1,'questionId':1},function(err,results) {
                should.not.exist(err);
                done();
            });
        });
        it("inserts an invalid vote into the database", function(done) {
            database.recordVote({'answerId':5,'questionId':1},function(err,results) {
                should.exist(err);
                done();
            });
        });
    });
});