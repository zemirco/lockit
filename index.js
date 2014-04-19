
var path = require('path');
var events = require('events');
var util = require('util');
var express = require('express');
var chalk = require('chalk');
var extend = require('node.extend');
var Signup = require('lockit-signup');
var Login = require('lockit-login');
var ForgotPassword = require('lockit-forgot-password');
var DeleteAccount = require('lockit-delete-account');
var lockitUtils = require('lockit-utils');

var configDefault = require('./config.default.js');

// wrapper for independent modules
var Lockit = module.exports = function(config) {

  if (!(this instanceof Lockit)) return new Lockit(config);

  // create config if none is given
  config = config || {};

  // need for emitting events
  var that = this;

  // check for database settings - use SQLite as fallback
  if (!config.db) {
    config.db = {
      url: 'sqlite://',
      name: ':memory:',
      collection: 'my_user_table'
    };
    console.log(chalk.bgBlack.green('lockit'), 'no db config found. Using SQLite.');
  }

  // check for email settings
  if (!config.emailType || !config.emailSettings) {
    console.log(chalk.bgBlack.green('lockit'), 'no email config found. Check your database for tokens.');
  }

  // use default values for all values that aren't provided
  // true for deep extend
  config = extend(true, configDefault, config);

  // create db adapter only once and pass it to modules
  var db = lockitUtils.getDatabase(config);
  var adapter = require(db.adapter)(config);

  // load all required modules
  var signup = new Signup(config, adapter);
  var login = new Login(config, adapter);
  var deleteAccount = new DeleteAccount(config, adapter);
  var forgotPassword = new ForgotPassword(config, adapter);

  // router
  var router = express.Router();

  // send all GET requests for lockit routes to '/index.html'
  if (config.rest) {

    var __parentDir = path.dirname(module.parent.filename);

    var routes = [
      config.signup.route,
      config.signup.route + '/resend-verification',
      config.signup.route + '/:token',
      config.login.route,
      config.login.logoutRoute,
      config.forgotPassword.route,
      config.forgotPassword.route + '/:token',
      config.deleteAccount.route,
    ];

    routes.forEach(function(route) {
      router.get(route, function(req, res) {
        // check if user would like to render a file or use static html
        if (config.rest.useViewEngine) {
          res.render(config.rest.index, {
            basedir: req.app.get('views')
          });
        } else {
          res.sendfile(path.join(__parentDir, config.rest.index));
        }
      });
    });

  }

  // expose name and email to template engine
  router.use(function(req, res, next) {
    res.locals.name = req.session.name || '';
    res.locals.email = req.session.email || '';
    // continue with next middleware
    next();
  });

  // add submodule routes
  router.use(signup.router);
  router.use(login.router);
  router.use(deleteAccount.router);
  router.use(forgotPassword.router);
  this.router = router;


  // pipe events to lockit
  signup.on('signup', function(user, res) {
    that.emit('signup', user, res);
  });

  signup.on('signup::post', function(user) {
    if (config.db.url === 'sqlite://' && config.db.name === ':memory:') {
      console.log(
        chalk.bgBlack.green('lockit'),
        chalk.bgBlack.yellow('http://localhost:3000/signup/' + user.signupToken),
        'cmd + double click on os x'
      );
    }
    that.emit('signup::post', user);
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
