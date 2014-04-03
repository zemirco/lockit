
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
