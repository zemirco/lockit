
var debug = require('debug')('lockit');
var extend = require('xtend');
var path = require('path');

var signup = require('lockit-signup');
var login = require('lockit-login');
var forgotPassword = require('lockit-forgot-password');
var deleteAccount = require('lockit-delete-account');

var configDefault = require('./config.default.js');

// create couchdb views
function createCouchDBViews(config) {

  // create db connection
  var db = require('nano')({
    url: config.dbUrl,
    request_defaults: config.request_defaults
  });

  // list of couchdb views
  var views = {
    _id: '_design/users',
    views: {
      username: {
        map: function(doc) {
          emit(doc.username, doc);
        }
      },
      email: {
        map: function(doc) {
          emit(doc.email, doc);
        }
      },
      signupToken: {
        map: function(doc) {
          emit(doc.signupToken, doc);
        }
      },
      pwdResetToken: {
        map: function(doc) {
          emit(doc.pwdResetToken, doc);
        }
      }
    }
  };

  // check if views were already created
  db.get('_design/users', function(err, body) {
    if (err && err.status_code === 404) {
      debug('No CouchDB views found. Creating them ...');
      // save views to db if they don't exist
      db.insert(views, function(err, body) {
        if (err) console.log(err);
        debug('CouchDB views created');
      });
    } else if (err) {
      console.log(err);
    } else {
      debug('Found CouchDB views in database');
    }
  });

}

// just a wrapper around the single modules
module.exports = function(app, config) {

  // set basedir so views can properly extend layout.jade
  var __parentDir = path.dirname(module.parent.filename);
  app.locals.basedir = __parentDir + '/views';
  
  // check for database settings - only ones that are really required
  if (!config.db || !config.dbUrl) throw new Error('Please specify database settings');

  // check for email settings
  if (!config.emailType || !config.emailSettings) {
    debug('Email configuration incomplete. Using "stub". Check your database for tokens.');
  }
  
  // create views if we are working with CouchDB
  if (config.db === 'couchdb') createCouchDBViews(config);
  
  // use default values for all values that aren't provided
  config = extend(configDefault, config);

  // expose username and email to template engine
  app.use(function(req, res, next) {
    res.locals.username = req.session.username || '';
    res.locals.email = req.session.email || '';
    // continue with next middleware
    next();
  });
  
  // load all required modules
  signup(app, config);
  login(app, config);
  forgotPassword(app, config);
  deleteAccount(app, config);

};