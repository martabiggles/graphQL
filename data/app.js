const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 

let mongo;
async function context() {
  if (!mongo) {
    mongo = await MongoClient.connect('mongodb://localhost:27017')
    mongo = mongo.db('graphQlWorkshopDB')
  }
    return mongo
}
// Connection URL
// const url = 'mongodb://localhost:27017';
 
// // Database Name
// const dbName = 'graphQlWorkshopDB';

// // Use connect method to connect to the server
// const mongo = MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
 
//   return client.db(dbName);
//});

module.exports = context;