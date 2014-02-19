//Attach global variables
require('../modules/globals');

var Q = require("q");
var should = require('should');
var database = require('../modules/database-test');

describe("addQuestions", function(){
    it("inserts questions and answers into the database for a survey that already has questions into the database", function(done) {
        database.addQuestions({ "surveyId":1, "questions": [{"question": "Question 1", "type":"MCSR", "answers": ["Q1a1", "Q1a2", "Q1a3", "Q1a4"]}],"password":"supersecretpassword" },function(err,results) {
            try {
                should.not.exist(err);
                done();
            } catch(testerror) {
                done(testerror);
            }
        });
    });
    it("inserts two questions and answers for a survey that already has questions into the database", function(done) {
        database.addQuestions({ "surveyId":1, "questions": [{"question": "Question 1", "type":"MCSR", "answers": ["Q1a1", "Q1a2", "Q1a3", "Q1a4"]},{"question": "Question 2", "type":"MCSR", "answers": ["Q2a1", "Q2a2", "Q2a3", "Q2a4"]}],"password":"supersecretpassword" },function(err,results) {
            try {
                should.not.exist(err);
                done();
            } catch(testerror) {
                done(testerror);
            }
        });
    });
    it.skip("inserts questions and answers into the database for a survey that has no questions into the database", function(done) {
        database.addQuestions({ "surveyId":1, "questions": [{"question": "Question 1", "type":"MCSR", "answers": ["Q1a1", "Q1a2", "Q1a3", "Q1a4"]}],"password":"supersecretpassword" },function(err,results) {
            try {
                should.not.exist(err);
                done();
            } catch(testerror) {
                done(testerror);
            }
        });
    });
    it.skip("inserts two questions and answers into the database for a survey that has no questions into the database", function(done) {
        database.addQuestions({ "surveyId":1, "questions": [{"question": "Question 1", "type":"MCSR", "answers": ["Q1a1", "Q1a2", "Q1a3", "Q1a4"]}],"password":"supersecretpassword" },function(err,results) {
            try {
                should.not.exist(err);
                done();
            } catch(testerror) {
                done(testerror);
            }
        });
    });
});

