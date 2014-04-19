
// settings for local MongoDB
exports.db = {
  url: 'mongodb://localhost:27017/',
  name: 'lockit',
  collection: 'users'
};

// settings for MongoDB in cloud (i.e. MongoLab or MongoHQ)
// exports.db = {
//   url: 'mongodb://<user>:<password>@<id>.mongolab.com:<port>/',
//   name: 'lockit',
//   collection: 'users'
// };
