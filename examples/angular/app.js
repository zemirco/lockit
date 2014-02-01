
/**
 * Module dependencies
 */

var express = require('express'),
    http = require('http'),
    path = require('path');

var app = express();

var config = require('./config.js');
var lockit = require('lockit');
var utls = require('lockit-utils');

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.cookieSession());
app.use(express.static(path.join(__dirname, 'public')));

lockit(app, config);

app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

/**
 * JSON API
 */

app.get('/rest/whoami', utls.restrict(config), function(req, res) {
  res.json({
    username: req.session.username
  });
});


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
