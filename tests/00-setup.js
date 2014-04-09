
var sys = require('sys');
var exec = require('child_process').exec;
var should = require('should');
var Q = require("q");
var database = require('../modules/database-test');

beforeEach(function (done) {
    this.timeout(8000);
    //in case changes are made in the future, downgrade to when this db squash was made
    var downcommand = "db-migrate up 20140319 -e test && db-migrate down 20140319 -e test";
    // reset the contents of the database
    var resetDBQuery = "DELETE FROM vote WHERE \"questionId\">0;\
                        DELETE FROM answer WHERE \"questionId\">0;\
                        DELETE FROM question WHERE \"surveyId\">0;\
                        DELETE FROM survey WHERE id>0;\
                        ALTER SEQUENCE vote_id_seq RESTART WITH 1;\
                        ALTER SEQUENCE answer_id_seq RESTART WITH 1;\
                        ALTER SEQUENCE question_id_seq RESTART WITH 1;\
                        ALTER SEQUENCE survey_id_seq RESTART WITH 1;\
                        INSERT INTO survey(title, password) VALUES('A sweet survey', 'supersecretpassword'); \
                        INSERT INTO question(\"surveyId\", value, type) VALUES(1, 'What is your favorite color?','MCSR'); \
                        INSERT INTO answer(\"questionId\", value) VALUES(1, 'red');\
                        INSERT INTO answer(\"questionId\", value) VALUES(1, 'green');\
                        INSERT INTO answer(\"questionId\", value) VALUES(1, 'blue');\
                        INSERT INTO answer(\"questionId\", value) VALUES(1, 'orange');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(1, 1,'00000000-0000-0000-0000-000000000001');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(1, 1,'00000000-0000-0000-0000-000000000002');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(1, 1,'00000000-0000-0000-0000-000000000003');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(1, 1,'00000000-0000-0000-0000-000000000004');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(1, 1,'00000000-0000-0000-0000-000000000005');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(1, 1,'00000000-0000-0000-0000-000000000006');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(2, 1,'00000000-0000-0000-0000-000000000007');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(2, 1,'00000000-0000-0000-0000-000000000008');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(2, 1,'00000000-0000-0000-0000-000000000009');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(2, 1,'00000000-0000-0000-0000-000000000010');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(2, 1,'00000000-0000-0000-0000-000000000011');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(3, 1,'00000000-0000-0000-0000-000000000012');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(3, 1,'00000000-0000-0000-0000-000000000013');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(3, 1,'00000000-0000-0000-0000-000000000014');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(4, 1,'00000000-0000-0000-0000-000000000015');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(4, 1,'00000000-0000-0000-0000-000000000016');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(4, 1,'00000000-0000-0000-0000-000000000017');\
                        INSERT INTO vote(\"answerId\", \"questionId\", \"userId\") VALUES(4, 1,'00000000-0000-0000-0000-000000000018');"

    var upcommand = "db-migrate up -e test";

    exec(downcommand, function (error, stdout, stderr) {
        if (stderr) {
            console.log(stderr);
            //pass-through if this fails, since it should be caught by the db-migrate test
            done();
        } else {
            database.runQuery(resetDBQuery,[])
            .then(function(dbresult) {
                exec(upcommand, function (error, stdout, stderr) {
                    if (stderr)
                        console.log(stderr);
                    //pass-through if this fails, since it should be caught by the db-migrate test
                    done();
                });
            })
            .fail(function(err) {
                console.log("Error running db reset query: " + stderr);
                //don't pass-through if this fails, since something must have gone terribly wrong (something forgotten in a down migration?)
            });
        }
    });
});
