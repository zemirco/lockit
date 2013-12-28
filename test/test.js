
// just test for the default routes as in depth tests are included in each module
var request = require('supertest');
var should = require('should');

var app = require('./app.js');

describe('lockit', function() {

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

