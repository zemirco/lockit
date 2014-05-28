
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
var utils = require('lockit-utils');
var configDefault = require('./config.default.js');



/**
 * Lockit constructor function.
 *
 * @constructor
 * @param {Object} config
 */
var Lockit = module.exports = function(config) {

  if (!(this instanceof Lockit)) return new Lockit(config);

  this.config = config || {};
  var that = this;

  if (!this.config.db) this.database();
  if (!this.config.emailType || !this.config.emailSettings) this.email();

  // use default values for all values that aren't provided
  this.config = extend(true, configDefault, this.config);

  // create db adapter only once and pass it to modules
  var db = utils.getDatabase(this.config);
  this.adapter = this.config.db.adapter || require(db.adapter)(this.config);

  // load all required modules
  var signup = new Signup(this.config, this.adapter);
  var login = new Login(this.config, this.adapter);
  var deleteAccount = new DeleteAccount(this.config, this.adapter);
  var forgotPassword = new ForgotPassword(this.config, this.adapter);

  // router
  this.router = express.Router();

  // send all GET requests for lockit routes to '/index.html'
  if (this.config.rest) this.rest();

  // expose name and email to template engine
  this.router.use(function(req, res, next) {
    res.locals.name = req.session.name || '';
    res.locals.email = req.session.email || '';
    next();
  });

  // add submodule routes
  this.router.use(signup.router);
  this.router.use(login.router);
  this.router.use(deleteAccount.router);
  this.router.use(forgotPassword.router);

  // pipe events to lockit
  var emitters = [signup, login, deleteAccount];
  utils.pipe(emitters, that);

  // special event for quick start
  signup.on('signup::post', function(user) {
    if (that.config.db.url === 'sqlite://' && that.config.db.name === ':memory:') {
      message = 'http://localhost:3000/signup/' + user.signupToken;
      console.log(
        chalk.bgBlack.green('lockit'),
        chalk.bgBlack.yellow(message),
        'cmd + double click on os x'
      );
    }
    that.emit('signup::post', user);
  });

  events.EventEmitter.call(this);

};

util.inherits(Lockit, events.EventEmitter);



/**
 * Use SQLite as fallback database.
 *
 * @private
 */
Lockit.prototype.database = function() {
  this.config.db = {
    url: 'sqlite://',
    name: ':memory:',
    collection: 'my_user_table'
  };
  var message = 'no db config found. Using SQLite.';
  console.log(chalk.bgBlack.green('lockit'), message);
};



/**
 * Stub emails.
 *
 * @private
 */
Lockit.prototype.email = function() {
  var message = 'no email config found. Check your database for tokens.';
  console.log(chalk.bgBlack.green('lockit'), message);
};



/**
 * Send all routes to Single Page Application entry point.
 *
 * @private
 */
Lockit.prototype.rest = function() {
  var that = this;
  var __parentDir = path.dirname(module.parent.filename);

  var routes = [
    this.config.signup.route,
    this.config.signup.route + '/resend-verification',
    this.config.signup.route + '/:token',
    this.config.login.route,
    this.config.login.logoutRoute,
    this.config.forgotPassword.route,
    this.config.forgotPassword.route + '/:token',
    this.config.deleteAccount.route,
  ];

  routes.forEach(function(route) {
    that.router.get(route, function(req, res) {
      // check if user would like to render a file or use static html
      if (that.config.rest.useViewEngine) {
        res.render(that.config.rest.index, {
          basedir: req.app.get('views')
        });
      } else {
        res.sendfile(path.join(__parentDir, that.config.rest.index));
      }
    });
  });
};
