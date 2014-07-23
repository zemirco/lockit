
var request = require('supertest');
var should = require('should');

describe('lockit', function() {

  describe('# with rest enabled', function() {

    var app;

    before(function(done) {
      var config = require('./config');
      config.port = 4000;
      config.rest = {
        index: 'public/index.html',
        useViewEngine: false
      };
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

      it('should point ' + route + ' to public/index.html', function(done) {
        request(app)
          .get(route)
          .end(function(err, res) {
            res.text.should.containEql('This is index.html');
            done();
          });
      });

    });

  });

  describe('# with rest enabled and restIndexPage is .jade file', function() {

    var app;

    before(function(done) {
      var config = require('./config');
      config.port = 5000;
      config.rest = {
        index: 'main',
        useViewEngine: true
      };
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

      it('should render main.jade for route ' + route, function(done) {
        request(app)
          .get(route)
          .end(function(err, res) {
            res.text.should.containEql('This is from main.jade');
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
          res.text.should.containEql('<title>Sign up</title>');
          done();
        });
    });

    it('should include the login module', function(done) {
      request(app)
        .get('/login')
        .end(function(err, res) {
          res.statusCode.should.equal(200);
          res.text.should.containEql('<title>Login</title>');
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
          res.text.should.containEql('<title>Forgot password</title>');
          done();
        });
    });

  });

  describe('custom adapter', function() {

    it('should use custom adapter from config.db.adapter', function(done) {

      var adapter = {
        save: function(name, email, pw, cb) {
          name.should.equal('john');
          email.should.equal('john@email.com');
          pw.should.equal('password');
          done();
        },
        find: function(query, match, cb) {
          cb(null, false);
        }
      };

      var config = require('./config');
      config.port = 6000;
      config.db = {
        url: 'http://127.0.0.1:5984/',
        adapter: adapter
      };
      app = require('./app.js')(config);

      request(app)
        .post('/signup')
        .send({name: 'john', email: 'john@email.com', password: 'password'})
        .end(function(err, res) {});

    });

  });

});
