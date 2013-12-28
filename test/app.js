
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var lockit = require('../index.js');
var config = require('./config.js');

var app = express();

// set basedir so views can properly extend layout.jade
app.locals.basedir = __dirname + '/views';

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());

// activate sessions
app.use(express.cookieParser('your secret here'));
app.use(express.cookieSession());

app.use(app.router);

// load lockit routes
lockit(app, config);

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// export app for testing purpose
module.exports = app;