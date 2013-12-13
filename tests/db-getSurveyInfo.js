var Q = require("q");
var should = require('should');
var database = require('../modules/database');

describe("getSurveyInfo", function(){
    it("gets a valid survey", function(done) {
        database.getSurveyInfo({'surveyId':1},function(err,results) {
            try {
                //make sure we didn't get an error
                should.not.exist(err);

                //test the default db response
                results.should.have.keys('title', 'questions');
                results['title'].should.eql("A sweet survey");
                results["questions"].should.be.type("object");
                results["questions"].length.should.not.be.below(1);
                results["questions"][0].should.eql({"id":1,"surveyId":1,"value":"What is your favorite color?","type": "MCSR","answers":[{"id":1,"questionId":1,"value":"red"},{"id":2,"questionId":1,"value":"green"},{"id":3,"questionId":1,"value":"blue"},{"id":4,"questionId":1,"value":"orange"}]});

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

