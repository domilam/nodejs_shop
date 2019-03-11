const path = require('path');
const rootProject = path.dirname(process.mainModule.filename);
const cart = {};
const adminController = require('./adminControllerMg');
const mongodb = require('mongodb');
const getDb = require('../util/databaseMongo_prod').getDb;
const ObjectId = mongodb.ObjectId;
const User = require('../models/userMg');
const Product = require('../models/productMg').products;
const limit_per_page = require('../models/productMg').limit_prod
const stripe = require("stripe")("sk_test_kdYtScGYfWZ528mQtGdqmBS2");


exports.indexCtrl = (req, res, next) => {
    let countProduct;
    let hide = true;
    let flash = req.flash('error');
    console.log(...flash);
    let errorMessage = flash.length == 0 ? [] : [{msg: [...flash]}];
    // errorMessage.push(req.flash('error'));
    // if (errorMessage.length == 0){
    //     errorMessage = null;
    // }
    console.log('errormessage: '+errorMessage);
    console.log(req.user);
    if (!req.session.user){
        countProduct = req.countProduct;

    }else{
        countProduct = req.user.countProduct();
    }
    isHide = !(req.query.isHide == 'false');
    if (isHide){
        res.locals.isHide = true;
    }else{
        res.locals.isHide = false;
    }
    console.log(req.flash('error'));
    res.render('index.ejs', {
        path: '/',
        countProduct: countProduct,
        errorMessage: errorMessage,
        hide: hide,
        validationErrors: [],

        oldRegistration: {}
    });
};

exports.displayCart = (req, res, next) => {
    const user = req.user;
    let countProduct;
    let sumProducts = 0;
    if (!req.session.user){
        countProduct = req.countProduct;
    }else{
        countProduct = req.user.countProduct();
    }

    user.displayCart(products=>{
        products.forEach(prod => {
            sumProducts += prod.quantity * prod.prix;
        });
        console.log('++++++++++++++++++++++',sumProducts);
        
        res.render('shop/displayCartMg', {
            products: products,
            path: '/cart',
            countProduct: countProduct,
            hide:true,
            validationErrors: [],
            oldRegistration: {},
            sumProducts: sumProducts

        });
    })
};

exports.deleteProdCart = (req, res, next) => {
    const productId = req.body.productId;
    const user = req.user;
    console.log('yyyyyyyyyyyyyyyyyyyy'+user.cart);
    console.log(productId);
    user.deleteProdCart(productId, result => {
        console.log('delete');
        res.redirect("/cart");
    });
};
exports.addCart = (req, res, next) => {
    const prodId = req.body.prodId;
    let productFetched;
    let newQuantity = 1;
    let user_var;
    let panierFetched;
    const db = getDb();
    req.user.addCart(req.body.prodId)
    .then(result => {
        console.log(result);
        res.redirect('/products');
    });
};
exports.addOrder = (req, res, next) =>{
    let sumProducts = 0;

    let countProduct;
    if (!req.user){
        countProduct = req.countProduct;
    }else{
        countProduct = req.user.countProduct();
    }

    req.user.addOrder(insertedId => {

        // Token is created using Checkout or Elements!
        // Get the payment token ID submitted by the form:
        const token = req.body.stripeToken; // Using Express

        console.log('ttttttttttttttttttt '+insertedId);
        req.user.getOrderById(insertedId)
        .then(order => {
            console.log(order);
            order[0].items.forEach(prod => {
                sumProducts += prod.quantity * prod.prix;
            });

        // (async () => {
            const charge = stripe.charges.create({
                amount: sumProducts * 100,
                currency: 'eur',
                description: 'Commande Démo',
                source: token,
                metadata: {order_id: order[0]._id.toString()}
            });

            // })();
            req.user
            .getOrders()
            .then(orders => {
                console.log(orders);
                res.render('shop/ordersMg', {
                    path: '/orders',
                    orders: orders,
                    countProduct: countProduct,
                    hide: true,
                    validationErrors: [],
                    oldRegistration: {}
        
                });
            });
        })
        .catch(err => console.log(err));
    
    });
};
exports.getOrders = (req, res, next) => {
    let countProduct;
    if (!req.user){
        countProduct = req.countProduct;
    }else{
        countProduct = req.user.countProduct();
    }

    req.user
    .getOrders()
    .then(orders => {
        console.log(orders);
        res.render('shop/ordersMg', {
            path: '/orders',
            orders: orders,
            countProduct: countProduct,
            hide: true,
            validationErrors: [],

            oldRegistration: {}

        });
    })
    .catch(err => console.log(err));
};
exports.getPayment = (req, res, next) => {
    const user = req.user;
    let countProduct;
    let sumProducts = 0;
    if (!req.session.user){
        countProduct = req.countProduct;
    }else{
        countProduct = req.user.countProduct();
    }

    user.displayCart(products=>{
        products.forEach(prod => {
            sumProducts += prod.quantity * prod.prix;
        });
        console.log('++++++++++++++++++++++',sumProducts);
 
        res.render('shop/payment', {
            products: products,
            path: '/payment',
            countProduct: countProduct,
            hide:true,
            validationErrors: [],
            oldRegistration: {},
            sumProducts: sumProducts

        });
    });
}
exports.listProducts = (req, res, next) =>{
    let countProduct;
    let TotalProducts;
    let nextPage;
    let previousPage;

    
    let page = req.query.page;
    if (!page){
        page = 1;
    }
    if (!req.user){
        countProduct = req.countProduct;
    }else{
        countProduct = req.user.countProduct();
    }

    Product.countTotalProducts()
    .then(countProd =>{
        TotalProducts = countProd;

        nextPage = parseInt(page) + 1;
        previousPage = parseInt(page) -1;
        return Product.fetchPage(page, null)
    })
    .then(prods=>{
        res.render('shop/productsMg', {
            products: prods,
            path: '/admin/products',
            countProduct: countProduct,
            hide: true,
            validationErrors: [],
            oldRegistration: {},
            currentPage: parseInt(page),
            hasNextPage: limit_per_page * parseInt(page) < TotalProducts,
            hasPreviousPage: parseInt(page) > 1,
            nextPage: nextPage,
            previousPage: previousPage,
            lastPage: Math.ceil(TotalProducts / limit_per_page )
        });
        
    })
    .catch(err=>{
        console.log(err);
    })
};

