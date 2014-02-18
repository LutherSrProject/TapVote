var Q = require("q");
var should = require('should');
var database = require('../modules/database');

describe("removeAnswer", function(){
    it("inserts a new answer into the database, then removes it", function(done) {
        database.addAnswer({"questionId":1, "value":"new answer"}, function(err,results) {
            try {
                should.not.exist(err);
                database.removeAnswer({"questionId":1, "answerId":results['answerId']}, function(err, results) {
                    if(err)
                        should.not.exist(err);
                    else {
                        done();
                    }
                });
            } catch(testerror) {
                done(testerror);
            }
        });
    });
});

