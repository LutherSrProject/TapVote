
// Doing this allows routes, etc to only require database.js instead of
// each individual database module.

exports.addQuestions = require("./database/addQuestions").addQuestions;
exports.createSurvey = require("./database/createSurvey").createSurvey;
exports.getSurveyInfo = require("./database/getSurveyInfo").getSurveyInfo;
exports.getSurveyResults = require("./database/getSurveyResults").getSurveyResults;
exports.recordVote = require("./database/recordVote").recordVote;
exports.removeQuestion = require("./database/removeQuestion").removeQuestion;
exports.addQuestions = require("./database/addQuestions").addQuestions;




