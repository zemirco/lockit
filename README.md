# Lockit

[![Build Status](https://travis-ci.org/zeMirco/lockit.png?branch=master)](https://travis-ci.org/zeMirco/lockit) [![NPM version](https://badge.fury.io/js/lockit.png)](http://badge.fury.io/js/lockit)

[![NPM](https://nodei.co/npm/lockit.png)](https://nodei.co/npm/lockit/)

Lockit is an Express module that offers routes and methods for user registration / authentication.

It consists of multiple single purpose modules:

 - [lockit-login](https://github.com/zeMirco/lockit-login)
 - [lockit-signup](https://github.com/zeMirco/lockit-signup)
 - [lockit-delete-account](https://github.com/zeMirco/lockit-delete-account)
 - [lockit-forgot-password](https://github.com/zeMirco/lockit-forgot-password)
 - [lockit-sendmail](https://github.com/zeMirco/lockit-sendmail)
 - [lockit-couchdb-adapter](https://github.com/zeMirco/lockit-couchdb-adapter)
 - [lockit-mongodb-adapter](https://github.com/zeMirco/lockit-mongodb-adapter)
 - [lockit-utilities](https://github.com/zeMirco/lockit-utilities)
 - [lockit-template-blank](https://github.com/zeMirco/lockit-template-blank)

## Installation

  1. `npm install lockit`

    ```js
    var config = require('./config.js');
    var lockit = require('lockit');
    
    var app = express();
    
    // express middleware
    // ...
    // sessions are required
    app.use(express.cookieParser('your secret here'));
    app.use(express.cookieSession());
    app.use(app.router);
    
    // use middleware after router so it doesn't interfere with your own routes
    lockit(app, config);
    
    // continue with express middleware
    // ...
    ```

  2. Views are built with [bootstrap](http://getbootstrap.com/):

    - download `bootstrap.min.css`
    - copy to `/public/css/`
    - load the file in `layout.jade` -> `link(rel='stylesheet', href='/css/bootstrap.min.css')`

  3. Install your database adapter `npm install lockit-[DB]-adapter` where `[DB]` can be
  
    - [CouchDB](http://couchdb.apache.org/) `npm install lockit-couchdb-adapter`
    - [MongoDB](http://www.mongodb.org/) `npm install lockit-mongodb-adapter`

## Configuration

You need a `config.js` file somewhere in your app. 
Here is a minimalistic one to get started
 
```js
// database settings for CouchDB
exports.db = 'couchdb';
exports.dbUrl = 'http://127.0.0.1:5984/test';

// or if you want to use MongoDB
// exports.db = 'mongodb';
// exports.dbUrl = 'mongodb://127.0.0.1/test';
// exports.dbCollection = 'users';
```

The only thing you need is a database. 
If you are using CouchDB you have to create the necessary views. 

 - run `config=[PATH] node node_modules/lockit/createCouchViews.js`
 
`[PATH]` should be the location of your `config.js`, i.e.

`config=./config.js node node_modules/lockit/createCouchViews.js`
 
In case you are using MongoDB or any other DB you are good to go.

By default the email service is stubbed and no emails are sent. 
That means that you won't receive any signup and password reset tokens. 
You have to look them up in your database and call the routes manually (e.g. `/signup/:token`).
To send emails you need an email server and you have to change the settings in your `config.js`:

 - `emailType` - usually `SMTP`
 - `emailSettings` - see [nodemailer](https://github.com/andris9/Nodemailer) for more information

If you want to go crazy and customize all the things you can:

```js
// name for subject and email content
exports.appname = 'Test App';

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
exports.signupRoute = '/signup';
exports.signupTokenExpiration = '1 day';

// login settings
exports.loginRoute = '/login';
exports.logoutRoute = '/logout';

// forgot password settings
exports.forgotPasswordRoute = '/forgot-password';
exports.forgotPasswordTokenExpiration = '1 day';

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
  title: 'Welcome to <%- appname %>',
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
  title: 'Email already registered',
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
  title: 'Complete your registration',
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
  title: 'Reset your password',
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
 - CouchDB and MongoDB support out of the box
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

Copyright (C) 2013 [Mirco Zeiss](mailto: mirco.zeiss@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.