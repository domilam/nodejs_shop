const path = require('path');
const rootProject = path.dirname(process.mainModule.filename);
const cart = {};
const adminController = require('./adminController');
const Product = require('../models/product');
const User = require('../models/user');
const Panier = require('../models/panier');
const ProductPanier = require('../models/productPanier');



exports.indexCtrl = (req, res, next) => {
    // res.sendFile(path.join(rootProject, '/views/index.html'));
    res.render('index.ejs', {
        products: adminController.products,
        path: '/'
    });
};

exports.displayCart = (req, res, next) => {
    let sumProducts = 0;

    User.findByPk(1)
    .then(user => {
        user_var = user;
        return user.getPanier();
    })
    .then(panier => {
        return panier.getProducts();
    })
    .then(products => {
        products.forEach(prod => {
            sumProducts += prod.quantity * prod.prix;
        });
        console.log('++++++++++++++++++++++',sumProducts);
        res.render('shop/displayCart', {
            products: products,
            path: '/cart',
            sumProducts: sumProducts
        });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.addCart = (req, res, next) => {
    const prodId = req.body.prodId;
    let productFetched;
    let newQuantity = 1;
    let user_var;
    let panierFetched;

    // on récupère le produit
    Product.findByPk(prodId)
    .then(product => {
        if (product){
            productFetched = product;
        }
    })
    .catch(err => {
        console.log(err);
    });

    User.findByPk(1)
    .then(user => {
        user_var = user;
        return user.getPanier();
    })
    .then(panier => {
        if (!panier){
            // Le panier n'existe pas, on le créé
            return user_var.createPanier({date: new Date()})
            .then(panier => {
                return panier.addProduct(productFetched, {through: {quantite: newQuantity}});
            })
            .catch(err => {console.log(err);});
        }else{
            return panier;
        }
    })
    .then(panier => {
        panierFetched = panier;
        return panier.getProducts({where: {id: prodId}});
    })
    .then(productPanier => {
        if (productPanier.length > 0){
            // Le panier existe et le produit existe, on rajoute une quantité
            productFetched = productPanier[0];
            productFetched.productPanier.quantite += 1;
            return productFetched.productPanier.save();
        }else{
            // Le panier exist mais le produit n'y est pas on le créé
            panierFetched.addProduct(productFetched, {through: {quantite: newQuantity}})
            .then(product => {
                console.log(product);
                return;
            })
            .catch(err => {
                console.log(err);
            });
        }
        console.log(productPanier);
    })
    .then(result => {
        return panierFetched.getProducts();
    })
    .then(products => {
        console.log()
        res.render('shop/displayCart', {
            products: products,
            path: '/cart'
        });
    })
    .catch(err => {
        console.log(err);
    });
}
