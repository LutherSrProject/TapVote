var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.runSql( 'CREATE TABLE survey ( \
                    id           serial    PRIMARY KEY, \
                    title        text, \
                    password     text \
                ); \
\
                CREATE TABLE question ( \
                    id           serial    PRIMARY KEY,\
                    "surveyId"   integer   REFERENCES survey(id),\
                    value        text\
                );\
\
                CREATE TABLE answer (\
                    id           serial    PRIMARY KEY,\
                    "questionId" integer   REFERENCES question(id) ,\
                    value text\
                );\
\
                CREATE TABLE vote (\
                    id           serial,\
                    "questionId" integer   REFERENCES question(id),\
                    "answerId"   integer   REFERENCES answer(id)\
                );\
           ', callback);
};

exports.down = function(db, callback) {

};
