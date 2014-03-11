
var request = require('supertest');
var should = require('should');

describe('lockit', function() {

  describe('# with rest enabled', function() {

    var app;

    before(function(done) {
      var config = require('./config');
      config.port = 4000;
      config.rest = true;
      app = require('./app.js')(config);
      done();
    });

    var routes = [
      '/login',
      '/logout',
      '/signup',
      '/signup/some-token',
      '/signup/resend-verification',
      '/delete-account',
      '/forgot-password',
      '/forgot-password/some-token'
    ];

    routes.forEach(function(route) {

      it('should point ' + route + ' to index', function(done) {
        request(app)
          .get(route)
          .end(function(err, res) {
            res.text.should.include('This is index.html');
            done();
          });
      });

    });

  });

  describe('# without rest', function() {

    var app;

    before(function(done) {
      var config = require('./config');
      config.port = 3000;
      config.rest = false;
      app = require('./app.js')(config);
      done();
    });

    it('should include the signup module', function(done) {
      request(app)
        .get('/signup')
        .end(function(err, res) {
          res.statusCode.should.equal(200);
          res.text.should.include('<title>Sign up</title>');
          done();
        });
    });

    it('should include the login module', function(done) {
      request(app)
        .get('/login')
        .end(function(err, res) {
          res.statusCode.should.equal(200);
          res.text.should.include('<title>Login</title>');
          done();
        });
    });

    it('should include the delete account module', function(done) {
      request(app)
        .get('/delete-account')
        .end(function(err, res) {
          // no session -> redirected to /login
          res.statusCode.should.equal(302);
          done();
        });
    });

    it('should include the forgot password module', function(done) {
      request(app)
        .get('/forgot-password')
        .end(function(err, res) {
          res.statusCode.should.equal(200);
          res.text.should.include('<title>Forgot password</title>');
          done();
        });
    });

  });

});
