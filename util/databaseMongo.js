const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
// ?retryWrites=true
let _db;
const MONGODB_URI = 'mongodb+srv://dominique:dGpHfPLFuG6omh8J@cluster0-9sf1g.mongodb.net/shop';
const mongoConnect = (callback) =>{
    MongoClient.connect(MONGODB_URI)
    .then(client => {
        console.log("Connected !!");
        _db = client.db();
        console.log(_db);
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