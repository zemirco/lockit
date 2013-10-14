
var signup = require('lockit-signup');
var login = require('lockit-login');
var forgotPassword = require('lockit-forgot-password');
var deleteAccount = require('lockit-delete-account');

// just a wrapper around the single modules
module.exports = function(app, config) {

  signup(app, config);
  login(app, config);
  forgotPassword(app, config);
  deleteAccount(app, config);

};