
var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var Lockit = require('../');
var config = require('./config.js');
var lockit = new Lockit(config);

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(cookieSession({
  secret: 'this is my super secret string'
}));
app.use(lockit.router);
http.createServer(app).listen(7000);

var should = require('should');
var request = require('supertest');

describe('events', function() {

  before(function(done) {
    lockit.adapter.save('event', 'event@email.com', 'password', function(err, user) {
      if (err) console.log(err);
      lockit.adapter.find('name', 'event', function(err, user) {
        if (err) console.log(err);
        user.emailVerified = true;
        lockit.adapter.update(user, function(err, user) {
          if (err) console.log(err);
          done();
        });
      });
    });
  });

  var agent = request.agent('http://localhost:7000');

  it('should emit "signup" event', function(done) {
    lockit.on('signup', function(user, res) {
      user.name.should.equal('john');
      done();
    });
    agent
      .post('/signup')
      .send({name: 'john', email: 'john@email.com', password: 'password'})
      .end(function(err, res) {
        if (err) console.log(err);
        // get token from db
        lockit.adapter.find('name', 'john', function(err, user) {
          if (err) console.log(err);
          // visit /signup/:token
          agent
            .get('/signup/' + user.signupToken)
            .end(function() {});
        });
      });
  });

  it('should emit "login" event', function(done) {
    lockit.on('login', function(user, res, target) {
      user.name.should.equal('event');
      target.should.equal('/');
      done();
    });
    agent
      .post('/login')
      .send({login:'event', password:'password'})
      .end(function(err, res) {
        if (err) console.log(err);
      });
  });

  it('should emit "logout" event', function(done) {
    lockit.on('logout', function(user, res) {
      user.name.should.equal('event');
      done();
    });
    agent
      .get('/logout')
      .end(function(err, res) {
        if (err) console.log(err);
      });
  });

  it('should emit "delete" event', function(done) {
    // remove 'login' event listener
    lockit.removeAllListeners();
    lockit.on('delete', function(user, res) {
      user.name.should.equal('event');
      done();
    });
    // login first because last test logged agent out
    agent
      .post('/login')
      .send({login:'event', password:'password'})
      .end(function(err, res) {
        if (err) console.log(err);
        // post delete account
        process.nextTick(function() {
          agent
            .post('/delete-account')
            .send({name: 'event', password: 'password', phrase: 'please delete my account forever'})
            .end(function(err, res) {
              if (err) console.log(err);
            });
        });
      });
  });

  after(function(done) {
    lockit.adapter.remove('john', done);
  });

});
