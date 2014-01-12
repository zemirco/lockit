
// load config to get db settings
var configLocation = process.env.config;
var config = require(configLocation);

// create db connection
var db = require('nano')(config.dbUrl);

// list of couchdb views
var views = {
  _id: '_design/users',
  views: {
    username: {
      map: function(doc) {
        emit(doc.username, doc);
      }
    },
    email: {
      map: function(doc) {
        emit(doc.email, doc);
      }
    },
    signupToken: {
      map: function(doc) {
        emit(doc.signupToken, doc);
      }
    },
    pwdResetToken: {
      map: function(doc) {
        emit(doc.pwdResetToken, doc);
      }
    }
  }
};

// create couchdb views
function createCouchDBViews() {
  
  // check if views were already created
  db.get('_design/users', function(err) {
    
    // no couchdb views found
    if (err && err.status_code === 404) {
      console.log('No CouchDB views found. Creating them ...');
      // save views to db
      db.insert(views, function(err, body) {
        if (err) console.log(err);
        console.log('CouchDB views created');
      });
      return;
    }
    
    // some other error occurred
    if (err) {
      console.log(err);
      return;
    } 
    
    // views are already in db
    console.log('Found CouchDB views in database');
    
  });
  
}

// run fn
createCouchDBViews();