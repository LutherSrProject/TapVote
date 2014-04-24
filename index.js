//Attach global variables
require('./modules/globals');

var cookieSecret = process.env.TAPVOTE_COOKIE_SECRET;

if (!cookieSecret) {
    cookieSecret = 'your secret here';
}

/**
 * Module dependencies.
 */
var express = require('express');
var PGStore = require('connect-pg');
var cors = require('cors');
var vote = require('./routes/vote');
var deVote = require('./routes/deVote');
var getSurveyResults = require('./routes/getSurveyResults');
var getUserVotes = require('./routes/getUserVotes');
var getSurveyInfo = require('./routes/getSurveyInfo');
var getSurveyTotalVotersByQuestion = require('./routes/getSurveyTotalVotersByQuestion');
var createSurvey = require('./routes/createSurvey');
var addQuestions = require('./routes/addQuestions');
var removeQuestion = require('./routes/removeQuestion');
var addAnswer = require('./routes/addAnswer');
var removeAnswer = require('./routes/removeAnswer');
var dbConnSetup = require('./modules/database/dbConnSetup');
var pgConnectSession = dbConnSetup.pgConnectSession;
var initSession = require('./modules/initsession');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.use(express.favicon());
app.use(express.json()); //express's json request body parser
app.use(express.urlencoded()); //in the off chance that we use urlencoded requests
//notably, leaving out file upload support for now
app.use(express.methodOverride());
app.use(express.cookieParser(cookieSecret));
app.use(express.session({store: new PGStore(pgConnectSession), cookie: {maxAge: 10 * 24 * 60 * 60 * 1000}}));


// artificially add a second of latency to every request :)
app.use(function(req,res,next){setTimeout(next,1000)});

// TODO investigate a CORS whitelist
var corsOptions = {
    origin: true,
    credentials: true
};
app.use(cors(corsOptions));

app.use(initSession.initSession);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'www')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/vote', vote.vote());
app.post('/deVote', deVote.deVote());
app.post('/createSurvey', createSurvey.createSurvey());
app.post('/addQuestions', addQuestions.addQuestions());
app.post('/removeQuestion', removeQuestion.removeQuestion());
app.post('/addAnswer', addAnswer.addAnswer());
app.post('/removeAnswer', removeAnswer.removeAnswer());
app.get('/getSurveyResults', getSurveyResults.getSurveyResults());
app.get('/getUserVotes', getUserVotes.getUserVotes());
app.get('/getSurveyInfo', getSurveyInfo.getSurveyInfo());
app.get('/getSurveyTotalVotersByQuestion', getSurveyTotalVotersByQuestion.getSurveyTotalVotersByQuestion());

http.createServer(app).listen(app.get('port'), function() {
  logger.info('Express server listening on port ' + app.get('port'));
});

exports.logger = logger; // export the Winston logger
