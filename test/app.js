
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

var Lockit = require('../index.js');

function start(config) {

  var app = express();

  config = config || require('./config.js');

  // all environments
  app.set('port', process.env.PORT || config.port ||  3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(favicon());
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cookieParser());
  app.use(cookieSession({
    secret: 'this is my super secret string'
  }));

  // load lockit routes
  var lockit = new Lockit(config);
  app.use(lockit.router);

  // development only
  if ('development' == app.get('env')) {
    app.use(errorHandler());
  }

  app.get('/', routes.index);
  app.get('/users', user.list);

  http.createServer(app).listen(app.get('port'));

  return app;

}

// export app for testing
if(require.main === module){
  // called directly
  start();
} else {
  // required as a module -> from test file
  module.exports = function(config) {
    return start(config);
  };
}
