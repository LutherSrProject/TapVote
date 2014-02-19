/*
 * Doing this allows routes, etc to only require database.js instead of
 * each individual database module.
 */

CONNSTRING = "postgres://postgres:wearetapvote@localhost/tapvotetest";

exports.addQuestions = require("./database/addQuestions").addQuestions;
exports.createSurvey = require("./database/createSurvey").createSurvey;
exports.getSurveyInfo = require("./database/getSurveyInfo").getSurveyInfo;
exports.getSurveyResults = require("./database/getSurveyResults").getSurveyResults;
exports.recordVote = require("./database/recordVote").recordVote;
exports.deleteVote = require("./database/deleteVote").deleteVote;
exports.removeQuestion = require("./database/removeQuestion").removeQuestion;
exports.addQuestions = require("./database/addQuestions").addQuestions;
exports.addAnswer = require("./database/addAnswer").addAnswer;




