
/**
 * Module dependencies.
 */

var express = require('express');
var vote = require('./routes/vote');
var powerdata = require('./routes/powerdata');
var minutedata = require('./routes/minutedata');
var http = require('http');
var path = require('path');

var app = express();


// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
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

/*app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});*/

app.post('/vote', vote.vote);
app.post('/powerdata', powerdata.powerdata);
app.post('/minutedata', minutedata.minutedata);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
