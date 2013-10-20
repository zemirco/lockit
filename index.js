
var signup = require('lockit-signup');
var login = require('lockit-login');
var forgotPassword = require('lockit-forgot-password');
var deleteAccount = require('lockit-delete-account');

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
    if (err) console.log(err);

    // save views to db if they don't exist
    if (!body) {
      db.insert(views, function(err, body) {
        if (err) console.log(err);
        console.log('done');
      });
    }

  });

}

// just a wrapper around the single modules
module.exports = function(app, config) {

  // create views if we are working with CouchDB
  if (config.db === 'couchdb') createCouchDBViews(config);

  // load all required modules
  signup(app, config);
  login(app, config);
  forgotPassword(app, config);
  deleteAccount(app, config);

};