const mongodb = require('mongodb');
const MONGODB_URI = require('./keys.js').mongoUrl;

const MongoClient = mongodb.MongoClient;
// ?retryWrites=true
let _db;
const mongoConnect = (callback) =>{
    MongoClient.connect(MONGODB_URI)
    .then(client => {
        console.log("Connected !!");
        _db = client.db();
        // console.log(_db);
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
}

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No database found';
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
exports.mongodb_uri = MONGODB_URI;