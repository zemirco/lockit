##### v0.2.0 - 2014-01-24

 - replace [xtend](https://github.com/Raynos/xtend) by [node.extend](https://github.com/dreamerslab/node.extend) to allow for nested object in default config
 - drop `dbUrl` and only use `db` in `config.js` for connection string
 - drop `title` from email messages and use `subject` instead
 - get type of database and lockit adapter from db connection string
 - enable custom views