const getDb = require('../util/databaseMongo_prod').getDb;
const mongoDb = require('mongodb');
const ObjectId = mongoDb.ObjectId;

class User {
    constructor(username, email, password, token, date, cart, id){
        this.username = username;
        this.email = email;
        this.password = password;
        this.token = token,
        this.expireDate = date,
        this.cart = cart; //{items: []}
        this._id = id;
    }
    save(){
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    update(){
        const db = getDb();
        console.log('****'+this.expireDate);
        console.log('****'+this.token);
        return db.collection('users').updateOne({_id: new ObjectId(this._id)},
            {$set: {
                username: this.username,
                email: this.email,
                password: this.password,
                token: this.token,
                expireDate: this.expireDate,
                cart: this.cart,
                _id: new ObjectId(this._id)
                }
            });
    }

    addCart(productId){
        const db = getDb();

        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === productId.toString();
        });
        let updatedCart = this.cart;

        if (cartProductIndex >=0){
            let newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCart.items[cartProductIndex].quantity = newQuantity;

        }else{
            updatedCart.items.push({productId: new ObjectId(productId), quantity: 1});
        }
        this.cart = updatedCart;
        return db.collection('users').updateOne(
            {_id: new ObjectId(this._id)},
            {$set: {cart: updatedCart}}
        );

    }

    displayCart(cb){
        const db = getDb();
        let prodIdUser = this.cart.items.map(item => {
            return item.productId;
        });
        console.log(prodIdUser);
        db.collection('products').find({_id: {$in: prodIdUser}}).toArray()
        .then(prods => {
            return cb(prods.map(prod => {
                    return {...prod, quantity: this.cart.items.filter(item => {
                                return item.productId.toString() === prod._id.toString();
                            })[0].quantity};
            }));
        });
    }
    
    static findUserById(userId){
        const db = getDb();
        return db.collection('users').find({_id: new ObjectId(userId)}).next();
    }

    static findUserByEmail(email){
        const db = getDb();
        return db.collection('users').find({email: email}).next();
    }

    static findUserByToken(token){
        const db = getDb();
        return db.collection('users').find({token: token}).next();
    }
    
    deleteProdCart(productId, cb){
        const db = getDb();
        let indexProduct = this.cart.items.findIndex(item => item.productId.toString() === productId.toString());
        this.cart.items.splice(indexProduct, 1);
        return cb(db.collection('users').updateOne({_id: new ObjectId(this._id.toString())},
            {$set: {
                username: this.username,
                email: this.email,
                password: this.password,
                token: this.token,
                expireDate: this.token,
                cart: this.cart,
                _id: new ObjectId(this._id)
             }
            }
            ));
    }
    countProduct(){
        const db = getDb();
        let countProduct = 0;
        for (let item of this.cart.items){
            countProduct += item.quantity;
        };
        return countProduct;
    }

    addOrder(cb){
        const db = getDb();
        let insertedId;
        this.displayCart(products => {
            const order = {
                items: products,
                user: {
                    _id: new ObjectId(this._id),
                    name: this.username,
                    email: this.email
                }
            };
            return db.collection('orders').insertOne(order)
            .then(result => {
                insertedId = result.insertedId;
                console.log('rrrrrrrrrrrrrrrrrrrrrrrrrr'+insertedId);
                this.cart = {items: []};
                return db
                .collection('users')
                .updateOne(
                    {_id: new ObjectId(this._id)},
                    {$set: { cart: this.cart}}
                );
            })
            .then(result => {
                cb(insertedId);
            })
            .catch(err => console.log(err));
        });
    }

    getOrders(){
        const db = getDb();
        return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
    }
    getOrderById(orderId){
        const db = getDb();
        return db.collection('orders').find({'_id': orderId}).toArray();
    }
}
module.exports = User;