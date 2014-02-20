//Attach global variables
require('../modules/globals');

var Q = require("q");
var should = require('should');
var database = require('../modules/database-test');

describe("removeAnswer", function(){
    it("inserts a new answer into the database, then removes it", function(done) {
        database.addAnswer({"questionId":1, "value":"new answer"}, function(err,results) {
            try {
                should.not.exist(err, "addAnswer failed, so unable to test removeAnswer");
                database.removeAnswer({"questionId":1, "answerId":results['answerId']}, function(err, results) {
                    should.not.exist(err);
                    done();
                });
            } catch(testerror) {
                done(testerror);
            }
        });
    });
    it("inserts a new answer into the database, then tries to remove it with an incorrect questionId specified", function (done) {
        database.addAnswer({"questionId":1, "value":"new answer"}, function(err,results) {
            try {
                should.not.exist(err, "addAnswer failed, so unable to test removeAnswer");
                database.removeAnswer({"questionId":2, "answerId":results['answerId']}, function(err, results) {
                    should.exist(err);
                    done();
                })
            } catch(testerror) {
                done(testerror)
            }
        });
    });
    it("tries to remove non-existent answer", function (done) {
        database.removeAnswer({"questionId":1, "answerId":0}, function(err, results) {
            try {
                should.exist(err);
                done();
            } catch(testerror) {
                done(testerror)
            }
        });
    });
});

