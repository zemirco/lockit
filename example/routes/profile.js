
/*
 * GET profile page.
 */

var moment = require('moment');
var config = require('../config.js');

// load database adapter
var adapter = require('lockit-' + config.db + '-adapter')(config);

exports.index = function(req, res){
  
  // get user email from current session
  var email = req.session.email;

  // get user from db
  adapter.find('email', email, function(err, user) {
    if (err) console.log(err);

    // set title some user infos
    var infos = {
      title: 'Profile',
      previousLoginTime: moment(user.previousLoginTime).format('ddd, MMM Do YYYY - HH:mm:ss'),
      previousLoginIp: user.previousLoginIp,
      currentLoginTime: moment(user.currentLoginTime).format('ddd, MMM Do YYYY - HH:mm:ss'),
      currentLoginIp: user.currentLoginIp,
      failedLoginAttempts: req.session.failedLoginAttempts,
      memberFor: moment(user.emailVerificationTimestamp).fromNow(true)
    };
    
    // render view with information
    res.render('profile', infos);

  });

};