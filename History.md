
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
