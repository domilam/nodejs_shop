const path = require('path');
const rootProject = path.dirname(process.mainModule.filename);
const Product = require('../models/product');

// const productsTab = [];

exports.addProductCtrl = (req, res, next) => {
    // res.sendFile(path.join(rootProject, '/views/add-product.html'));
    res.render('add-product',{
        path: '/admin/add-product'
    });
};

exports.postProductCtrl = (req, res, next) => {
    console.log(req.body);
    const nom =req.body.nom;
    const prix =req.body.prix;
    const imageUrl =req.body.imageUrl;
    Product.create({nom: nom, prix: prix, imageUrl: imageUrl})
    .then(result=>{
        res.redirect('/admin/products');
    })
    .catch(err=>{
        console.log(err);
    });
    // productsTab.push(req.body);
};

exports.manageProducts = (req, res, next) => {
    Product.findAll()
    .then(prods=>{
        console.log(prods);
        res.render('manage-products', {
            products: prods,
            path: '/admin/manage-products'
        });
    
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.deleteProduct = (req, res, next) =>{
    console.log(req.body);
    Product.findByPk(req.body.prodId)
    .then(prod =>{
        return prod.destroy();
    })
    .then(result => {
        res.redirect('/admin/manage-products');
    })
    .catch(err => {
        console.log(err);
    })
}

exports.editProduct = (req, res, next) => {
    console.log(req.params);
    Product.findByPk(req.params.prodId)
    .then(prod => {
        console.log(prod);
        res.render('edit-product', {
            product: prod,
            path: '/admin/manage-products'
        });
    })
}

exports.postEditProduct = (req, res, next) => {
    const prod = req.body;
    // console.log(prod);
    // Product.update({id: prod.id, nom: prod.nom, prix: prod.prix, imageUrl: prod.imageUrl},
    //     where: {id: prod.id})
    
    Product.findByPk(prod.id)
    .then(product => {
        console.log(prod.nom);
        product.nom = prod.nom;
        product.prix = prod.prix;
        product.imageUrl = prod.imageUrl;
        return product;
    })
    .then(product => {
        product.save()
        .then(result => {
            res.redirect('/admin/manage-products');
        });
    })
    .catch(err => {
        console.log(err);
    });
}
exports.listProducts = (req, res, next) =>{
    Product.findAll()
    .then(prods=>{
        console.log(prods);
        res.render('products', {
            products: prods,
            path: '/admin/products'
        });
    
    })
    .catch(err=>{
        console.log(err);
    })
};

// exports.products = productsTab;