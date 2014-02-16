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

                // do some basic sanity checks on the first question in the survey
                var question = results["questions"][0];

                question["id"].should.eql(1);
                question["surveyId"].should.eql(1);
                question["value"].should.eql("What is your favorite color?");
                question["type"].should.eql("MCSR");

                question["answers"][0]["id"].should.eql(1);
                question["answers"][0]["questionId"].should.eql(1);
                question["answers"][0]["value"].should.eql("red");

                question["answers"][1]["id"].should.eql(2);
                question["answers"][1]["questionId"].should.eql(1);
                question["answers"][1]["value"].should.eql("green");

                //results["questions"][0].should.eql({"id":1,"surveyId":1,"value":"What is your favorite color?","type": "MCSR","answers":[{"id":1,"questionId":1,"value":"red"},{"id":2,"questionId":1,"value":"green"},{"id":3,"questionId":1,"value":"blue"},{"id":4,"questionId":1,"value":"orange"}]});

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

