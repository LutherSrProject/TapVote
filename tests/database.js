//Attach global variables
require('../modules/globals');
var Q = require("q");
var should = require('should');

var database = require('../modules/database');
describe("Database", function(){
    describe("createSurvey", function(){
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
    describe("recordVote", function(){
        it("inserts a valid vote into the database", function(done) {
            database.recordVote({'answerId':1,'questionId':1},function(err,results) {
                try {
                    should.not.exist(err);
                    done();
                } catch(testerror) {
                    done(testerror);
                } 
            });
        });
        it("inserts an invalid vote into the database", function(done) {
            database.recordVote({'answerId':5,'questionId':1},function(err,results) {
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
                } catch(testerror) {
                    done(testerror);
                } 
            });
        });
    });
    describe("getSurveyInfo", function(){
        it("gets a valid survey", function(done) {
            database.getSurveyInfo({'surveyId':1},function(err,results) {
                try {
                    //make sure we didn't get an error
                    should.not.exist(err);
                    
                    //test the default db response
                    results.should.eql({"title":"A sweet survey","questions":[{"id":1,"surveyId":1,"value":"What is your favorite color?","answers":[{"id":1,"questionId":1,"value":"red"},{"id":2,"questionId":1,"value":"green"},{"id":3,"questionId":1,"value":"blue"},{"id":4,"questionId":1,"value":"orange"}]}]});
                    
                    done();
                } catch(testerror) {
                    done(testerror);
                } 
            });
        });
        it("gets an invalid survey", function(done) {
            database.getSurveyInfo({'surveyId':0},function(err,results) {
                try {
                    should.exist(err,"expected to receive an error");
                    done();
                } catch(testerror) {
                    done(testerror);
                } 
            });
        });
    });
    describe("getSurveyResults", function(){
        describe("gets a valid survey and", function() {
            it("should return valid data", function(done) {
                database.getSurveyResults({'surveyId':1},function(err,results) {
                    try {
                        
                        //curl http://localhost:8000/getSurveyResults?surveyId=1
                        //{"1":"6","2":"5","3":"3","4":"4"}
                        
                        //make sure we didn't get an error
                        should.not.exist(err);
                        
                        //test the default db response
                        results.should.be.type('object').and.have.keys('1', '2', '3', '4');
                        results.should.not.have.property('5');
                        
                        results["1"].should.be.type("number");
                        results["2"].should.be.type("number");
                        results["3"].should.be.type("number");
                        results["4"].should.be.type("number");
                        
                        results["1"].should.not.be.below(6);
                        results["2"].should.not.be.below(5);
                        results["3"].should.not.be.below(3);
                        results["1"].should.not.be.below(4);
                        
                        done();
                    } catch(testerror) {
                        done(testerror);
                    } 
                });
            });
            it("should increment with a new vote", function(done) {
                var getSurveyResults = Q.denodeify(database.getSurveyResults);
                var recordVote = Q.denodeify(database.recordVote);
                
                getSurveyResults({'surveyId':1})
                .then(function(initialResults){
                    return recordVote({'answerId':2,'questionId':1})
                    .then(function(){
                        return getSurveyResults({'surveyId':1});
                    })
                    .then(function(finalResults){
                        (finalResults["2"] - initialResults["2"]).should.eql(1);
                        done();
                    });
                })
                .fail(function(error) {
                    done(error);
                });
            });
        });
        
        it("gets an invalid survey", function(done) {
            database.getSurveyResults({'surveyId':0},function(err,results) {
                try {
                    should.exist(err,"expected to receive an error");
                    done();
                } catch(testerror) {
                    done(testerror);
                } 
            });
        });
    });
});