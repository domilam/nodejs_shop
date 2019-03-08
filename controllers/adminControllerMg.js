const path = require('path');
const rootProject = path.dirname(process.mainModule.filename);
const Product = require('../models/productMg').products;
const limit_per_page = require('../models/productMg').limit_prod

const {ObjectId} = require('mongodb');
const { validationResult } = require('express-validator/check');

exports.addProductCtrl = (req, res, next) => {
    let countProduct;
    if (!req.user){
        countProduct = req.countProduct;
    }else{
        countProduct = req.user.countProduct();
    }
    const errors = validationResult(req);
    res.render('admin/add-product',{
        path: '/admin/add-product',
        countProduct: countProduct,
        errorMessage: errors.array(),
        hide: true,
        validationErrors: [],

        oldRegistration: {}

    });
};

exports.postProductCtrl = (req, res, next) => {
    console.log(req.body);
    const nom =req.body.nom;
    const prix =req.body.prix;
    const image =req.file;
    const userId = req.user._id
    const errors = validationResult(req);
    res.locals.isHide = true;
    let page = 1;
    let TotalProducts;

    let nextPage;
    let previousPage;

    //for testing db errors
    // const productId = new ObjectId('5c5ad76899f6a0bd32ab4f71');
    console.log(image);
    let countProduct;
    if (!req.user){
        countProduct = req.countProduct;
    }else{
        countProduct = req.user.countProduct();
    }

    let error = errors.array();
    if (!errors.isEmpty() || !image){
        if (!image){
            error.push({msg: "Le fichier n'est pas une image !!", param:'image'});
        }
        console.log('fffffffffff'+error[0].msg);
        res.locals.isHide = true;
        return res.status(422).render('admin/add-product', {
                path: '/admin/add-product',
                countProduct: countProduct,
                errorMessage: error,
                hide: true,
                validationErrors:error,
                oldRegistration: {
                    nom: nom,
                    prix: prix,
                },
                currentPage: parseInt(page),
                hasNextPage: limit_per_page * parseInt(page) < TotalProducts,
                hasPreviousPage: parseInt(page) > 1,
                nextPage: nextPage,
                previousPage: previousPage,
                lastPage: Math.ceil(TotalProducts / limit_per_page )
                    
            });
        
    }

    

    Product.countTotalProducts()
    .then(countProd =>{
        TotalProducts = countProd;
        nextPage = parseInt(page) + 1;
        previousPage = parseInt(page) -1;
        product = new Product(nom, prix, image.path, userId);
        return product.save();
    })
    .then(result => {
        console.log(result);
        return Product.fetchPage(page, null);
    })
    .then(prods => {
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
    .catch(err => {
        res.redirect('/500');  
    });

    // to test db errors
    // product = new Product(productId,nom, prix, imageUrl, userId);
};

exports.manageProducts = (req, res, next) => {
    let countProduct;
    let TotalProducts;
    let nextPage;
    let previousPage;
    if (!req.user){
        countProduct = req.countProduct;
    }else{
        countProduct = req.user.countProduct();
    }
    console.log('///////////////////'+req.user._id);
    let page = req.query.page;
    if (!page){
        page = 1;
    }

    Product.countTotalProducts()
    .then(countProd =>{
        TotalProducts = countProd;
        nextPage = parseInt(page) + 1;
        previousPage = parseInt(page) -1;
        return Product.fetchPage(page, {userId: req.user._id});
    })
    .then(prods => {
        res.render('admin/manage-productsMg', {
            products: prods,
            path: '/admin/manage-products',
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
    .catch(err => {
        res.redirect('/500');  
    });

}

exports.deleteProduct = (req, res, next) =>{
    console.log(req.body);
    const prodId = req.params.prodId
    Product.deleteProd(prodId)
    .then(result => {
        req.user.deleteProdCart(prodId, result => {
            // res.redirect('/admin/manage-products');
            res.status(200).json({message: 'Produit supprimé'});
        });
    })
    .catch(err => {
        res.status(500).json({message: 'La suppression a échouée !!'});
    })
}

exports.editProduct = (req, res, next) => {
    let countProduct;
    if (!req.user){
        countProduct = req.countProduct;
    }else{
        countProduct = req.user.countProduct();
    }
    // const errors = validationResult(req);
    
    Product.findById(req.params.prodId)
    .then(prods => {
        if (prods){
            res.render('admin/edit-productMg', {
                product: prods[0],
                path: '/admin/manage-products',
                countProduct: countProduct,
                errorMessage: [],
                hide: true,
                validationErrors: [],
                oldRegistration: {}
            });
        };
    });
}

exports.postEditProduct = (req, res, next) => {
    const prod = req.body;
    const nom = req.body.nom;
    const prix = req.body.prix;
    const image = req.file;
    const userId = req.user._id;
    let imageUrl;

    const errors = validationResult(req);
    res.locals.isHide = true;

    //for testing db errors
    // const productId = new ObjectId('5c5ad76899f6a0bd32ab4f71');
    console.log(image);
    let countProduct;
    if (!req.user){
        countProduct = req.countProduct;
    }else{
        countProduct = req.user.countProduct();
    }


    let error = errors.array();
    if (!errors.isEmpty()){
        console.log('fffffffffff'+error[0].msg);
        res.locals.isHide = true;
        return res.status(422).render('admin/edit-productMg', {
                path: '/admin/manage-products',
                countProduct: countProduct,
                errorMessage: error,
                hide: true,
                validationErrors:error,
                product: {
                    nom: nom,
                    prix: prix,
                    _id: prod.id
                },
                oldRegistration: {
                    nom: nom,
                    prix: prix,
                }
            });
        
    }

    if (image){
        imageUrl = image.path;
        Product.updateProd({id: (prod.id).toString(), nom: prod.nom, prix: prod.prix, imageUrl: imageUrl})
        .then(result => {
                res.redirect('/admin/manage-products');
        })
        .catch(err => console.log(err));
            
    }else{
        Product.findById(prod.id)
        .then(product => {
            console.log(product);
            imageUrl = product[0].imageUrl;
            return Product.updateProd({id: (prod.id).toString(), nom: prod.nom, prix: prod.prix, imageUrl: imageUrl})
        })
        .then(result => {
            res.redirect('/admin/manage-products');
        })
        .catch(err => console.log(err));
    }
}



