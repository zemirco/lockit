'use strict';

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
// app.set('views', __dirname + '/views');
app.set('views', path.join(__dirname, 'views'));
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
    lockit.adapter.save('event', 'event@email.com', 'password', function(err) {
      if (err) {console.log(err); }
      lockit.adapter.find('name', 'event', function(e, user) {
        if (e) {console.log(e); }
        user.emailVerified = true;
        lockit.adapter.update(user, function(error) {
          if (err) {console.log(error); }
          done();
        });
      });
    });
  });

  var agent = request.agent('http://localhost:7000');

  it('should emit "signup" event', function(done) {
    lockit.on('signup', function(user) {
      user.name.should.equal('john');
      done();
    });
    agent
      .post('/signup')
      .send({name: 'john', email: 'john@email.com', password: 'password'})
      .end(function(err) {
        if (err) {console.log(err); }
        // get token from db
        lockit.adapter.find('name', 'john', function(error, user) {
          if (err) {console.log(error); }
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
      .send({login: 'event', password: 'password'})
      .end(function(err) {
        if (err) {console.log(err); }
      });
  });

  it('should emit "logout" event', function(done) {
    lockit.on('logout', function(user) {
      user.name.should.equal('event');
      done();
    });
    agent
      .get('/logout')
      .end(function(err) {
        if (err) {console.log(err); }
      });
  });

  it('should emit "forgot::sent" event', function(done) {
    lockit.removeAllListeners();
    lockit.on('forgot::sent', function(user) {
      user.name.should.equal('event');
      done();
    });
    agent
      .post('/forgot-password')
      .send({email: 'event@email.com'})
      .end(function(err) {
        if (err) {console.log(err); }
      });
  });

  it('should emit "forgot::success" event', function(done) {
    lockit.removeAllListeners();

    lockit.on('forgot::success', function(user) {
      user.name.should.equal('event');
      done();
    });

    lockit.adapter.find('name', 'event', function(err, user) {
      if (err) {console.log(err); }
      var token = user.pwdResetToken;
      agent
        .post('/forgot-password/' + token)
        .send({password: 'new-password'})
        .end(function(error) {
          if (err) {console.log(error); }
        });
    });
  });

  it('should emit "delete" event', function(done) {
    // remove 'login' event listener
    lockit.removeAllListeners();
    lockit.on('delete', function(user) {
      user.name.should.equal('event');
      done();
    });
    // login first because last test logged agent out
    agent
      .post('/login')
      .send({login: 'event', password: 'new-password'})
      .end(function(err) {
        if (err) {console.log(err); }
        // post delete account
        process.nextTick(function() {
          agent
            .post('/delete-account')
            .send({name: 'event', password: 'new-password', phrase: 'please delete my account forever'})
            .end(function(error) {
              if (err) {console.log(error); }
            });
        });
      });
  });

  after(function(done) {
    lockit.adapter.remove('john', done);
  });

});
