var dbm = require('db-migrate');
var type = dbm.dataType;


exports.up = function(db, callback) {
    // let's generate some test data
    var queryString = "INSERT INTO survey(title, password) VALUES('A sweet survey', 'supersecretpassword'); \
                       INSERT INTO question(\"surveyId\", value) VALUES(1, 'What is your favorite color?'); \
                       INSERT INTO answer(\"questionId\", value) VALUES(1, 'red');\
                       INSERT INTO answer(\"questionId\", value) VALUES(1, 'green');\
                       INSERT INTO answer(\"questionId\", value) VALUES(1, 'blue');\
                       INSERT INTO answer(\"questionId\", value) VALUES(1, 'orange');\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(1, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(1, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(1, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(1, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(1, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(1, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(2, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(2, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(2, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(2, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(2, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(3, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(3, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(3, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(4, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(4, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(4, 1);\
                       INSERT INTO vote(\"answerId\", \"questionId\") VALUES(4, 1);\
                      ";
    db.runSql(queryString, callback);
};

exports.down = function(db, callback) {
    var queryString = "DELETE FROM vote WHERE \"questionId\">0;\
                       DELETE FROM answer WHERE \"questionId\">0;\
                       DELETE FROM question WHERE \"surveyId\">0;\
                       DELETE FROM survey WHERE id>0;\
                       ALTER SEQUENCE vote_id_seq RESTART WITH 1;\
                       ALTER SEQUENCE answer_id_seq RESTART WITH 1;\
                       ALTER SEQUENCE question_id_seq RESTART WITH 1;\
                       ALTER SEQUENCE survey_id_seq RESTART WITH 1;\
                      ";
    db.runSql(queryString, callback);
};
