
##### 1.1.0 - 2014-05-29

- expose db adapter as `lockit.adapter`
- allow usage of custom db adapter (fix #15)
- use `utils.pipe` method for event piping
- update dependencies
- add tests for event emitter

##### 1.0.0 - 2014-04-19

- requires Express 4.x
- makes use of `express.Router()`. No need to pass `app` around as an argument.

  **old**

  ```js
  var Lockit = require('lockit');

  var lockit = new Lockit(app, config);
  ```

  **new**

  ```js
  var Lockit = require('lockit');

  var lockit = new Lockit(config);
  app.use(lockit.router);
  ```

  Listening on events **stays the same**.

  ```js
  lockit.on('login', function(user, res, target) {
    res.send('Welcome ' + user.name);
  })
  ```

- proper Error handling. All Errors are piped to next middleware.

  **old**

  ```js
  if (err) console.log(err);
  ```

  **new**

  ```js
  if (err) return next(err);
  ```

  Make sure you have some sort of error handling middleware at the end of your
  routes (is included by default in Express 4.x apps if you use the `express-generator`).

- database configuration is a single object

  **old**

  ```js
  // database settings for CouchDB
  exports.db = 'http://127.0.0.1:5984/test';

  // or if you want to use MongoDB
  // exports.db = 'mongodb://127.0.0.1/test';
  // exports.dbCollection = 'users';
  ```

  **new**

  ```js
  // database settings for CouchDB
  exports.db = {
    url: 'http://127.0.0.1:5984/'  // important: no db at the end
  }

  // you can still use the short notation for CouchDB
  // because CouchDB doesn't need 'name' and 'collection'
  // exports.db = 'http://127.0.0.1:5984/';

  // or if you want to use MongoDB (SQL is similar)
  // exports.db = {
  //   url: 'mongodb://127.0.0.1/',
  //   name: 'test',
  //   collection: 'users'
  // }
  ```

##### 0.8.1 - 2014-04-14

- username (`name`) has to be lowercase and has to start with a letter

##### 0.8.0 - 2014-04-11

- per-user database with `_security` document in CouchDB with all users in `_users` database
- add support for optional `request_defaults` (used by lockit-couchdb-adapter)

  ```js
  exports.request_defaults = {
    // proxy: 'http://someproxy'
  };
  ```

- `username` becomes `name`
- use built-in [pbkdf2](http://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2_password_salt_iterations_keylen_callback)
  instead [bcrypt](https://github.com/ncb000gt/node.bcrypt.js/)
- improve `rest` config settings

  either

  ```js
  exports.rest = false;  // default setting
  ```

  or

  ```js
  exports.rest = {
    // set starting page for single page app
    index: 'public/index.html',

    // use view engine (render()) or send static file (sendfile())
    useViewEngine: false
  }
  ```


##### 0.7.2 - 2014-04-03

- add `exports.restIndexPage = 'public/index.html'` to default config

  You are now able to specify the starting page for your single page
  application. It defaults to `public/index.html`. The path is relative
  to your `app.js`. You can also choose a `.jade` file `exports.restIndexPage = 'main.jade'`.
  The path for the `.jade` file is relative to the folder you've set via
  `app.set('views', __dirname + '/views')` (in this case the `views/` folder).

...

##### 0.2.0 - 2014-01-24

- replace [xtend](https://github.com/Raynos/xtend) by [node.extend](https://github.com/dreamerslab/node.extend) to allow for nested object in default config
- drop `dbUrl` and only use `db` in `config.js` for connection string
- drop `title` from email messages and use `subject` instead
- get type of database and lockit adapter from db connection string
- enable custom views
