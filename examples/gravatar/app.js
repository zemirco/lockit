
/**
 * Module dependencies.
 */

var crypto = require('crypto');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var app = express();

var config = require('./config.js');
var Lockit = require('../../');
var adapter = require('lockit-couchdb-adapter')(config);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(cookieSession({
  secret: 'this is my super secret string'
}));
app.use(express.static(path.join(__dirname, 'public')));

var lockit = new Lockit(config);
app.use(lockit.router);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// get the gravatar image url for every new user
// signup.handleResponse is 'false' in 'config.js'
lockit.on('signup', function(user, res) {

  // get email from user object
  var email = user.email;

  // generate hash and url for gravatar api
  var hash = crypto.createHash('md5').update(email).digest('hex');
  var url = 'http://www.gravatar.com/avatar/' + hash;

  // update user information
  user.gravatar = url;

  // save updated user to db
  adapter.update(user, function(err, user) {
    if (err) console.log(err);

    // now send a response to the client
    res.render('gravatar', {
      name: user.name,
      gravatar: url
    });

  });

});

/**
 * Start Server
 */

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
