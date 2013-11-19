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
        "                     REFERENCES question(id);";

    db.runSql(queryString, callback);
};
