
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var crypto = require('crypto');

var Lockit = require('../../index.js');
var config = require('./config.js');
var adapter = require('lockit-couchdb-adapter')(config);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.cookieSession());

var lockit = new Lockit(app, config);

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
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
