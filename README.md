# Lockit

[![Build Status](https://travis-ci.org/zeMirco/lockit.png?branch=master)](https://travis-ci.org/zeMirco/lockit) [![NPM version](https://badge.fury.io/js/lockit.png)](http://badge.fury.io/js/lockit)

[![NPM](https://nodei.co/npm/lockit.png)](https://nodei.co/npm/lockit/)

Lockit is an authentication solution for [Express](http://expressjs.com/).

It consists of multiple single purpose modules:

 - [lockit-login](https://github.com/zeMirco/lockit-login)
 - [lockit-signup](https://github.com/zeMirco/lockit-signup)
 - [lockit-delete-account](https://github.com/zeMirco/lockit-delete-account)
 - [lockit-forgot-password](https://github.com/zeMirco/lockit-forgot-password)
 - [lockit-sendmail](https://github.com/zeMirco/lockit-sendmail)
 - [lockit-couchdb-adapter](https://github.com/zeMirco/lockit-couchdb-adapter)
 - [lockit-mongodb-adapter](https://github.com/zeMirco/lockit-mongodb-adapter)
 - [lockit-sql-adapter](https://github.com/zeMirco/lockit-sql-adapter)
 - [lockit-utilities](https://github.com/zeMirco/lockit-utilities)
 - [lockit-template-blank](https://github.com/zeMirco/lockit-template-blank)

## Installation

**I**. `npm install lockit`

  ```js
  var config = require('./config.js');
  var lockit = require('lockit');
  
  var app = express();
  
  // express middleware
  // ...
  // sessions are required
  app.use(express.cookieParser('your secret here'));
  app.use(express.cookieSession());
  
  // use middleware before router so your own routes have access to
  // req.session.email and req.session.username
  lockit(app, config);
  
  app.use(app.router);
  // continue with express middleware
  // ...
  ```

**II**. Views are built with [bootstrap](http://getbootstrap.com/). You can use [your own](#custom-views)!

  - download `bootstrap.min.css`
  - copy to `/public/css/`
  - load the file in `layout.jade` -> `link(rel='stylesheet', href='/css/bootstrap.min.css')`

**III**. Install your database adapter `npm install lockit-[DB]-adapter` where `[DB]` can be

  - [CouchDB](https://github.com/zeMirco/lockit-couchdb-adapter) `npm install lockit-couchdb-adapter`
  - [MongoDB](https://github.com/zeMirco/lockit-mongodb-adapter) `npm install lockit-mongodb-adapter`
  - [SQL (PostgreSQL, MySQL, MariaDB or SQLite)](https://github.com/zeMirco/lockit-sql-adapter) `npm install lockit-sql-adapter`
  
If you use a SQL database you also have to install the connector.

```
npm install pg       # for postgres
npm install mysql    # for mysql
npm install sqlite3  # for sqlite
npm install mariasql # for mariasql
```

## Configuration

You need a `config.js` file somewhere in your app.

### Database connection

The only thing you need is a database. 
Lockit currently supports the following ones:

 - CouchDB
 - MongoDB
 - PostgreSQL
 - MySQL
 - MariaDB (not yet tested but should work)
 - SQLite

Add your database connection settings to your `config.js`.
 
```js
// database settings for CouchDB
exports.db = 'http://127.0.0.1:5984/test';        // connection string for database

// or if you want to use MongoDB
// exports.db = 'mongodb://127.0.0.1/test';
// exports.dbCollection = 'users';                // collection name for MongoDB

// PostgreSQL
// exports.db = 'postgres://127.0.0.1:5432/users';
// exports.dbCollection = 'users';                // table name for SQL databases

// MySQL
// exports.db = 'mysql://127.0.0.1:9821/users';
// exports.dbCollection = 'users';

// SQLite
// exports.db = 'sqlite://:memory:';
// exports.dbCollection = 'users';
```
 
### Send emails

By default the email service is stubbed and no emails are sent. 
That means that you won't receive any signup and password reset tokens. 
You have to look them up in your database and call the routes manually (e.g. `/signup/:token`).
To send emails you need an email server and you have to change the settings in your `config.js`:

 - `emailType` - usually `SMTP`
 - `emailSettings` - see [nodemailer](https://github.com/andris9/Nodemailer) for more information
 
With [mailgun](http://www.mailgun.com/pricing) you can send up to 10,000 emails per month for free.

```js
exports.emailType = 'SMTP';
exports.emailSettings = {
  service: 'Mailgun',
  auth: {
    user: 'postmaster@username.mailgun.org',
    pass: 'secret-password'
  }
};
```

### Custom views

Lockit comes with built-in views which are based on Bootstrap.
If you want to use your own custom views you can. It is dead simple.

Put them into your `views` folder, for example `views/lockit/myLogin.jade`.
Then edit your `config.js` and set the path to your custom view.

```js
exports.login = {
  route: '/login',
  logoutRoute: '/logout',
  views: {
    login: 'lockit/myLogin.jade',
    loggedOut: 'lockit/myLogoutSuccess.jade'
  }
};
```

The only thing you have to keep in mind is the structure. The `login.views.login` view, for example,
needs a form element with two input fields. The `method` has to be `POST` and `action` should point
to your `login.route`. The input fields have to have the names `login` and `password`. If something
went wrong during the login process you'll get an `error` variable that you can use in your template.

Here is a minimalistic example for an alternative `myLogin.jade`.

```
extend /layout

block content
  h1 Login
  form(action="/login", method="POST")
    div
      label(for="login") Email or Username
      input(type="text", id="login", name="login", placeholder="Your email or username")
    div
      label(for="password") Password
      input(type="password", id="password", name="password", placeholder="Your password")
    if error
      p #{error}
    input(type="submit", value="Login")
```

For more information about each view see the `views` folder inside the different repositories.
Make sure your view extends `/layout` which is different to your normal views. They extend `layout`
without the slash. This is required to find the view.
 
### Example config

If you want to go crazy and customize all the things you can:

```js
// name for subject and email content
exports.appname = 'lockit - Test App';

// url for proper link generation
exports.url = 'http://localhost:3000';

// email settings (same as nodemailer)
exports.emailType = 'Stub';
exports.emailSettings = {
  service: 'none',
  auth: {
    user: 'none',
    pass: 'none'
  }
};

// email template from npm
exports.emailTemplate = 'lockit-template-blank';

// signup settings
exports.signup = {
  route: '/signup',
  tokenExpiration: '1 day',
  views: {
    signup: '',         // input fields 'username', 'email' and 'password' | local variable 'error' | POST /'signup.route'
    linkExpired: '',    // message link has expired | input field 'email' | POST /'signup.route'/resend-verification
    verified: '',       // message email is now verified and maybe link to /'login.route'
    signedUp: '',       // message email has been sent => check your inbox
    resend: ''          // input field 'email' | local variable 'error' | POST /'signup.route'/resend-verification
  }
};

// login settings
exports.login = {
  route: '/login',
  logoutRoute: '/logout',
  views: {
    login: '',          // input fields 'login' and 'password' | POST /'login.route' | local variable 'error'
    loggedOut: ''       // message that user logged out
  }
};

// forgot password settings
exports.forgotPassword = {
  route: '/forgot-password',
  tokenExpiration: '1 day',
  views: {
    forgotPassword: '', // input field 'email' | POST /'forgotPassword.route' | local variable 'error'
    newPassword: '',    // input field 'password' | POST /'forgotPassword.route'/#{token} | local variable 'error'
    changedPassword: '',// message that password has been changed successfully
    linkExpired: '',    // message that link has expired and maybe link to /'forgotPassword.route'
    sentEmail: ''       // message that email with token has been sent
  }
};

// delete account settings
exports.deleteAccount = {
  route: '/delete-account',
  views: {
    remove: '',         // input fields 'username', 'phrase', 'password' | POST /'deleteAccount.route' | local variable 'error'
    removed: ''         // message that account has been deleted
  }
};

// lock account
// show warning after three failed login attempts
exports.failedLoginsWarning = 3;
// lock account after five failed login attempts
exports.failedLoginAttempts = 5;
// lock account for 20 minutes
exports.accountLockedTime = '20 minutes';

// public email address of your app
exports.emailFrom = 'welcome@lock.it';

// email signup template
exports.emailSignup = {
  subject: 'Welcome to <%- appname %>',
  text: [
    '<h2>Hello <%- username %></h2>',
    'Welcome to <%- appname %>.',
    '<p><%- link %> to complete your registration.</p>'
  ].join(''),
  linkText: 'Click here'
};

// email already taken template
exports.emailSignupTaken = {
  subject: 'Email already registered',
  text: [
    '<h2>Hello <%- username %></h2>',
    'you or someone else tried to sign up for <%- appname %>.',
    '<p>Your email is already registered and you cannot sign up twice.',
    ' If you haven\'t tried to sign up, you can safely ignore this email. Everything is fine!</p>',
    '<p>The <%- appname %> Team</p>'
  ].join('')
};

// resend signup template
exports.emailResendVerification = {
  subject: 'Complete your registration',
  text: [
    '<h2>Hello <%- username %></h2>',
    'here is the link again. <%- link %> to complete your registration.',
    '<p>The <%- appname %> Team</p>'
  ].join(''),
  linkText: 'Click here'
};

// forgot password template
exports.emailForgotPassword = {
  subject: 'Reset your password',
  text: [
    '<h2>Hey <%- username %></h2>',
    '<%- link %> to reset your password.',
    '<p>The <%- appname %> Team</p>'
  ].join(''),
  linkText: 'Click here'
};
```

## Features

 - responsive html email template: [lockit-template-blank](https://github.com/zeMirco/lockit-template-blank)
 - support for wide range of databases out of the box
 - email address verification
 - account locking after too many failed login attempts
 - verification link expiration
 - failed login tracking
 - /login redirection when user is unauthorized
 - password hash generation with bcrypt
 - unit tests for all modules
 - implementation of [lots of](https://www.owasp.org/index.php/Guide_to_Authentication) [best](http://stackoverflow.com/questions/549/the-definitive-guide-to-form-based-website-authentication) [pratices](https://www.owasp.org/index.php/Authentication_Cheat_Sheet)


## Routes included

From [lockit-signup](https://github.com/zeMirco/lockit-signup)

 - GET /signup
 - POST /signup
 - GET /signup/:token
 - GET /signup/resend-verification
 - POST /signup/resend-verification

From [lockit-login](https://github.com/zeMirco/lockit-login)

 - GET /login
 - POST /login
 - GET /logout

From [lockit-forgot-password](https://github.com/zeMirco/lockit-forgot-password)

 - GET /forgot-password
 - POST /forgot-password
 - GET /forgot-password/:token
 - POST /forgot-password/:token

From [lockit-delete-account](https://github.com/zeMirco/lockit-delete-account)

 - GET /delete-account
 - POST /delete-account

## Test

`grunt`

## License

Copyright (C) 2014 [Mirco Zeiss](mailto: mirco.zeiss@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.