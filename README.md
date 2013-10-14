# Lockit

[![Build Status](https://travis-ci.org/zeMirco/lockit.png?branch=master)](https://travis-ci.org/zeMirco/lockit)

not ready yet .. come back later

Lockit is an Express module that offers routes for user registration. It should be used as a starting point to add user
 signup functionality to your app.

It consists of multiple single purpose modules:

 - [lockit-login](https://github.com/zeMirco/lockit-login)
 - [lockit-signup](https://github.com/zeMirco/lockit-signup)
 - [lockit-delete-account](https://github.com/zeMirco/lockit-delete-account)
 - [lockit-forgot-password](https://github.com/zeMirco/lockit-forgot-password)
 - [lockit-sendmail](https://github.com/zeMirco/lockit-sendmail)
 - [lockit-couchdb-adapter](https://github.com/zeMirco/lockit-couchdb-adapter)
 - [lockit-mongodb-adapter]()

## Features

 - responsive html email templates
 - full control over view and email templates
 - CouchDB and MongoDB support out of the box
 - email address verification
 - verification link expiration
 - failed login tracking
 - automatic password hash generation with bcrypt
 - implementation of best pratices
 - unit tests for all modules

## Installation

Simply install with `npm` and include the module in your Express configuration.

`npm install lockit`

```js
var config = require('./config.js');
var signup = require('lockit');

var app = express();

// set basedir so views can properly extend layout.jade
app.locals.basedir = __dirname + '/views';

// express settings
// ...

// sessions are required - either cookie or some sort of db
app.use(express.cookieParser('your secret here'));
app.use(express.cookieSession());
app.use(app.router);

// use middleware after router so it doesn't interfere with your own routes
lockit(app, config);

// serve static files as last middleware
app.use(express.static(path.join(__dirname, 'public')));
```

## Configuration

You need to have a `config.js` somewhere in your app. Load this file into your app and call `lockit` with `app` as the
first and `config` as the second argument.

You need two things to run `lockit`. A database and an email service. As of now CouchDB and MongoDB are supported out
of the box. More databases might come in the near future. The email service is needed to send email verification links
and forgot password links. All email functionality is provided by [lockit-sendmail](https://github.com/zeMirco/lockit-sendmail)
which uses [nodemailer](https://github.com/andris9/Nodemailer) under the hood. Therefore the settings are the same.

Here is a minimal `config.js`.

```js
```

## What routes are included?

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