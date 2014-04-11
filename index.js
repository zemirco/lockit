
var path = require('path');
var events = require('events');
var util = require('util');
var chalk = require('chalk');
var extend = require('node.extend');
var Signup = require('lockit-signup');
var Login = require('lockit-login');
var forgotPassword = require('lockit-forgot-password');
var DeleteAccount = require('lockit-delete-account');
var lockitUtils = require('lockit-utils');

var configDefault = require('./config.default.js');

// wrapper for independent modules
var Lockit = module.exports = function(app, config) {

  if (!(this instanceof Lockit)) return new Lockit(app, config);

  // create config if none is given
  config = config || {};

  // need for emitting events
  var that = this;

  // set basedir so views can properly extend layout.jade
  var __parentDir = path.dirname(module.parent.filename);
  app.locals.basedir = path.join(__parentDir, '/views');

  // check for database settings - use SQLite as fallback
  if (!config.db) {
    config.db = 'sqlite://:memory:';
    config.dbCollection = config.dbCollection || 'users';
    console.log(chalk.bgBlack.green('lockit'), 'no db config found. Using SQLite.');
  }

  // check for email settings
  if (!config.emailType || !config.emailSettings) {
    console.log(chalk.bgBlack.green('lockit'), 'no email config found. Check your database for tokens.');
  }

  // use default values for all values that aren't provided
  // true for deep extend
  config = extend(true, configDefault, config);

  // send all GET requests for lockit routes to '/index.html'
  if (config.rest) {

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
      app.get(route, function(req, res) {
        // check if user would like to render a file or use static html
        if (config.rest.useViewEngine) {
          res.render(config.rest.index);
        } else {
          res.sendfile(path.join(__parentDir, config.rest.index));
        }
      });
    });

  }

  // expose name and email to template engine
  app.use(function(req, res, next) {
    res.locals.name = req.session.name || '';
    res.locals.email = req.session.email || '';
    // continue with next middleware
    next();
  });

  // create db adapter only once and pass it to modules
  var db = lockitUtils.getDatabase(config);
  var adapter = require(db.adapter)(config);

  // load all required modules
  var signup = new Signup(app, config, adapter);
  var login = new Login(app, config, adapter);
  var deleteAccount = new DeleteAccount(app, config, adapter);
  forgotPassword(app, config, adapter);

  // pipe events to lockit
  signup.on('signup', function(user, res) {
    that.emit('signup', user, res);
  });

  signup.on('signup::post', function(user) {
    if (config.db === 'sqlite://:memory:') {
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
