/**
 * Module dependencies.
 */
var express = require('express');
var vote = require('./routes/vote');
var responses = require('./routes/responses');
var createSurvey = require('./routes/createSurvey');
var http = require('http');
var path = require('path');
var winston = require('winston');
logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({ colorize: true }),
            new (winston.transports.File)({ filename: 'logs/app.log' })
        ]
});

var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.json()); //express's json request body parser
app.use(express.urlencoded()); //in the off chance that we use urlencoded requests
//notably, leaving out file upload support for now
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/vote', vote.vote);
app.post('/createSurvey', createSurvey.createSurvey);
app.get('/responses', responses.responses);

http.createServer(app).listen(app.get('port'), function() {
  logger.info('Express server listening on port ' + app.get('port'));
});


exports.logger = logger; // export the Winston logger
