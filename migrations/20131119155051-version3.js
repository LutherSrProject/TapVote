var dbm = require('db-migrate');
var type = dbm.dataType;


// add on delete cascade
exports.up = function(db, callback) {
    var queryString = "ALTER TABLE question" +
        "                 DROP CONSTRAINT \"question_surveyId_fkey\"," +
        "                 ADD CONSTRAINT \"question_surveyId_fkey\"" +
        "                     FOREIGN KEY (\"surveyId\")" +
        "                     REFERENCES survey(id)" +
        "                     ON DELETE CASCADE;" +
        "" +
        "              ALTER TABLE answer" +
        "                 DROP CONSTRAINT \"answer_questionId_fkey\"," +
        "                 ADD CONSTRAINT \"answer_questionId_fkey\"" +
        "                     FOREIGN KEY (\"questionId\")" +
        "                     REFERENCES question(id)" +
        "                     ON DELETE CASCADE;" +
        "" +
        "              ALTER TABLE vote" +
        "                 DROP CONSTRAINT \"vote_answerId_fkey\"," +
        "                 DROP CONSTRAINT \"vote_questionId_fkey\"," +
        "                 ADD CONSTRAINT \"vote_questionId_fkey\"" +
        "                     FOREIGN KEY (\"questionId\")" +
        "                     REFERENCES question(id)" +
        "                     ON DELETE CASCADE," +
        "                 ADD CONSTRAINT \"vote_answerId_fkey\"" +
        "                     FOREIGN KEY (\"answerId\")" +
        "                     REFERENCES answer(id)" +
        "                     ON DELETE CASCADE;";

    db.runSql(queryString, callback);
};

exports.down = function(db, callback) {
    var queryString = "ALTER TABLE question" +
        "                 DROP CONSTRAINT \"question_surveyId_fkey\"," +
        "                 ADD CONSTRAINT \"question_surveyId_fkey\"" +
        "                     FOREIGN KEY (\"surveyId\")" +
        "                     REFERENCES survey(id);" +
        "" +
        "              ALTER TABLE answer" +
        "                 DROP CONSTRAINT \"answer_questionId_fkey\"," +
        "                 ADD CONSTRAINT  \"answer_questionId_fkey\"" +
        "                     FOREIGN KEY (\"questionId\")" +
        "                     REFERENCES question(id);" +
        "" +
        "              ALTER TABLE vote" +
        "                 DROP CONSTRAINT \"vote_answerId_fkey\"," +
        "                 DROP CONSTRAINT \"vote_questionId_fkey\"," +
        "                 ADD CONSTRAINT \"vote_questionId_fkey\"" +
        "                     FOREIGN KEY (\"questionId\")" +
        "                     REFERENCES question(id)," +
        "                 ADD CONSTRAINT \"vote_answerId_fkey\"" +
        "                     FOREIGN KEY (\"answerId\")" +
        "                     REFERENCES answer(id);";

    db.runSql(queryString, callback);
};
