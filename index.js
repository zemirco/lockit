
// require event emitter
var events = require('events');
var util = require('util');

var path = require('path');
var extend = require('node.extend');
var Signup = require('lockit-signup');
var Login = require('lockit-login');
var forgotPassword = require('lockit-forgot-password');
var DeleteAccount = require('lockit-delete-account');

var configDefault = require('./config.default.js');

// wrapper for independent modules
var Lockit = module.exports = function(app, config) {

  if (!(this instanceof Lockit)) {
    return new Lockit(app, config);
  }

  var that = this;

  // set basedir so views can properly extend layout.jade
  var __parentDir = path.dirname(module.parent.filename);
  app.locals.basedir = path.join(__parentDir, '/views');

  // check for database settings - only ones that are really required
  if (!config.db) throw new Error('Please specify database settings');

  // check for email settings
  if (!config.emailType || !config.emailSettings) {
    console.log('Email configuration incomplete -> using "stub".\nCheck your database for tokens.');
  }

  // use default values for all values that aren't provided
  // true for deep extend
  config = extend(true, configDefault, config);

  // send all GET requests for lockit routes to '/index.html'
  if (config.rest) {

    var routes = [
      config.signup.route,
      config.signup.route + '/:token',
      config.signup.route + '/resend-verification',
      config.login.route,
      config.login.logoutRoute,
      config.forgotPassword.route,
      config.forgotPassword.route + '/:token',
      config.deleteAccount.route,
    ];

    routes.forEach(function(route) {
      app.get(route, function(req, res) {
        res.sendfile(path.join(__parentDir, 'public', 'index.html'));
      });
    });

  }

  // expose username and email to template engine
  app.use(function(req, res, next) {
    res.locals.username = req.session.username || '';
    res.locals.email = req.session.email || '';
    // continue with next middleware
    next();
  });

  // load all required modules
  var signup = new Signup(app, config);
  var login = new Login(app, config);
  var deleteAccount = new DeleteAccount(app, config);
  forgotPassword(app, config);

  // pipe events to lockit
  signup.on('signup', function(user, res) {
    that.emit('signup', user, res);
  });

  login.on('login', function(user, res, target) {
    that.emit('login', user, res, target);
  });

  login.on('logout', function(user, res) {
    that.emit('logout', user, res);
  });

  deleteAccount.on('delete', function(user, res) {
    that.emit('delete', user, res);
  });

  events.EventEmitter.call(this);

};

util.inherits(Lockit, events.EventEmitter);
