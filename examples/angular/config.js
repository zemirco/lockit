
// use CouchDB
exports.db = 'http://127.0.0.1:5984/';

// or if you want to use rest
exports.rest = {

  // set starting page for single page app
  index: 'public/index.html',

  // use view engine (render()) or send static file (sendfile())
  useViewEngine: false

};
