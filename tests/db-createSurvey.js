//Attach global variables
require('../modules/globals');

var Q = require("q");
var should = require('should');
var database = require('../modules/database-test');


describe("createSurvey", function () {
    it("inserts a survey with questions and answers into the database", function(done) {
        database.createSurvey({ "title":"Test survey with questions and answers", "questions": [{"question": "Question 1", "type":"MCSR", "answers": ["Q1a1", "Q1a2", "Q1a3", "Q1a4"]}],"password":"supersecretpassword" },function(err,results) {
            try {
                should.not.exist(err);
                done();
            } catch(testerror) {
                done(testerror);
            }
        });
    });
    it("inserts a survey with two questions and answers into the database", function(done) {
        database.createSurvey({ "title":"Test survey with two questions and answers", "questions": [{"question": "Question 1", "type":"MCSR", "answers": ["Q1a1", "Q1a2", "Q1a3", "Q1a4"]},{"question": "Question 2", "type":"MCSR", "answers": ["Q2a1", "Q2a2", "Q2a3", "Q2a4"]}],"password":"supersecretpassword" },function(err,results) {
            try {
                should.not.exist(err);
                done();
            } catch(testerror) {
                done(testerror);
            }
        });
    });
    it("inserts a survey without questions into the database", function(done) {
        database.createSurvey({ "title":"Test survey with no questions","password":"supersecretpassword" },function(err,results) {
            try {
                should.not.exist(err);
                done();
            } catch(testerror) {
                done(testerror);
            }
        });
    });
});
