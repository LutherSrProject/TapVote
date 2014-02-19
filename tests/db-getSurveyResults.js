var Q = require("q");
var should = require('should');
var database = require('../modules/database-test');


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
