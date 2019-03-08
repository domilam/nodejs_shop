const getDb = require('../util/databaseMongo').getDb;
const {ObjectId} = require('mongodb');
const LIMIT_PRODUCTS_DISPLAYED = 12;
exports.limit_prod = LIMIT_PRODUCTS_DISPLAYED;

class Product{
    // for testing db errors
    // constructor(prodId,nom, prix, imageUrl, userId){
    constructor(nom, prix, imageUrl, userId){
        // for testing db errors
        // this.prodId = prodId;
        this.nom = nom;
        this.prix = prix;
        this.imageUrl = imageUrl;
        this.userId = userId
    }
    save(){
        const db = getDb();
        //for testing db errors
        // return db.collection('products').insertOne({_id: this.prodId, nom: this.nom, prix: this.prix, imageUrl: this.imageUrl, userId: this.userId});
        return db.collection('products').insertOne(this);
    }
    static fetchAll(filter){
        const db = getDb();
        if (!filter){
            return db.collection('products').find().toArray();
        }
        console.log('zzzzzzzzzzzzzz'+filter);
        return db.collection('products').find(filter).toArray();
    }
    static fetchPage(page, filter){
        const db = getDb();
        const nb_item_skiped = ((page - 1) * LIMIT_PRODUCTS_DISPLAYED);
        console.log('zzzzzzzzzzzzzz'+page+'-');
        if (!filter) return db.collection('products').find(filter).skip(nb_item_skiped).limit(LIMIT_PRODUCTS_DISPLAYED).toArray();
        return db.collection('products').find().skip(nb_item_skiped).limit(LIMIT_PRODUCTS_DISPLAYED).toArray();
    }
    static countTotalProducts(){
        const db = getDb();
        return db.collection('products').countDocuments({});
    }
    static findById(prodId){
        const db = getDb();
        return db.collection('products').find({_id: ObjectId(prodId)}).toArray();
    }
    static updateProd(prod){
        const db = getDb();
        let document = {nom: prod.nom, prix: prod.prix, imageUrl: prod.imageUrl};
        return db.collection('products').updateOne({_id: ObjectId(prod.id)}, {$set: document});
    }
    static deleteProd(prodId){
        const db = getDb();
        return db.collection('products').deleteOne({_id: ObjectId(prodId)})
    }
}

exports.products = Product;