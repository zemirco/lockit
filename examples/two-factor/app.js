'use strict';

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var Lockit = require('../../');
var utils = require('lockit-utils');
var uid = require('uid2');

var config = require('./config.js');
var adapter = require('lockit-couchdb-adapter')(config);
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(cookieSession({
  secret: 'my super secret String'
}));
app.use(express.static(path.join(__dirname, 'public')));

var lockit = new Lockit(config);
app.use(lockit.router);

app.use('/', routes);
app.use('/users', users);

// settings page
app.get('/settings', utils.restrict(config), function(req, res, next) {

  var email = req.session.email;

  // get user from db
  adapter.find('email', email, function(err, user) {
    if (err) {return next(err); }

    function render(key) {
      var options = {
        key: key,
        email: email
      };
      return res.render('settings', {
        qr: utils.qr(options)
      });
    }

    // check if user already has a key
    if (user.twoFactorKey) {return render(user.twoFactorKey); }

    // generate random key for two-factor authentication
    user.twoFactorKey = uid(20);

    // save (new) key to db
    adapter.update(user, function(error, usr) {
      if (error) {return next(error); }
      render(usr.twoFactorKey);
    });

  });

});

app.post('/settings', utils.restrict(config), function(req, res, next) {

  // get user from db to get the key
  adapter.find('email', req.session.email, function(err, user) {
    if (err) {return next(err); }

    var token = req.body.token;
    var key = user.twoFactorKey;
    var valid = utils.verify(token, key);

    if (valid) {

      // update user in db
      user.twoFactorEnabled = true;

      return adapter.update(user, function(error) {
        if (error) {return next(error); }
        res.send('two-factor auth now enabled.\n log out and back in');
      });

    }

    var options = {
      key: key,
      email: req.session.email
    };

    var qr = utils.qr(options);

    res.render('settings', {
      qr: qr,
      error: 'token invalid'
    });

  });

});

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


module.exports = app;

// DEBUG=my-application ./bin/www
