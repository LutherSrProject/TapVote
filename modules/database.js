/*
 * Doing this allows routes, etc to only require database.js instead of
 * each individual database module.
 */

// this should be used anytime we need to connect to the DB
var dbPassword = process.env.TAPVOTE_DATABASE_PASSWORD;

// if it's set in the environment, use that password. Otherwise, use "wearetapvote"
if (dbPassword)
    CONNSTRING = "postgres://postgres:" + dbPassword + "@localhost/tapvote";
else
    CONNSTRING = "postgres://postgres:wearetapvote@localhost/tapvote";


exports.addQuestions = require("./database/addQuestions").addQuestions;
exports.createSurvey = require("./database/createSurvey").createSurvey;
exports.getSurveyInfo = require("./database/getSurveyInfo").getSurveyInfo;
exports.getSurveyResults = require("./database/getSurveyResults").getSurveyResults;
exports.recordVote = require("./database/recordVote").recordVote;
exports.deleteVote = require("./database/deleteVote").deleteVote;
exports.removeQuestion = require("./database/removeQuestion").removeQuestion;
exports.addQuestions = require("./database/addQuestions").addQuestions;
exports.addAnswer = require("./database/addAnswer").addAnswer;
exports.removeAnswer = require("./database/removeAnswer").removeAnswer;
exports.pgConnect = require("./database/pgConnect").pgConnect;



