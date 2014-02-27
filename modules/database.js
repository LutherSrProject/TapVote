/*
 * Doing this allows routes, etc to only require database.js instead of
 * each individual database module.
 */


// this should be used anytime we need to connect to the DB
var dbProtocol = process.env.TAPVOTE_DATABASE_PROTOCOL;
if (!dbProtocol)
    dbProtocol = "postgres";
var dbUser = process.env.TAPVOTE_DATABASE_USER;
if (!dbUser)
    dbUser = "postgres";
// if it's set in the environment, use that password. Otherwise, use "wearetapvote"
var dbPassword = process.env.TAPVOTE_DATABASE_PASSWORD;
if (!dbPassword)
    dbPassword = "wearetapvote";
var dbHost = process.env.TAPVOTE_DATABASE_HOST;
if (!dbHost)
    dbHost = "localhost";
var dbDatabase = process.env.TAPVOTE_DATABASE_DATABASE;
if (!dbDatabase)
    dbDatabase = "tapvote";

CONNSTRING = dbProtocol + "://" + dbUser + ":" + dbPassword + "@" + dbHost + "/" + dbDatabase;

exports.dbProtocol = dbProtocol;
exports.dbUser = dbUser;
exports.dbPassword = dbPassword;
exports.dbHost = dbHost;
exports.dbDatabase = dbDatabase;
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



