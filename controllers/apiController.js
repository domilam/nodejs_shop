const Product = require('../models/productMg').products;

exports.getProducts = (req, res, next) => {
    let nextPage;
    let previousPage;
    let page = 1;
    
    Product.fetchPage(page, null)
    .then(prods=>{
        prods.forEach(prod => {
            prod.imageUrl = 'http://localhost:4000/' + prod.imageUrl;
        });
        res.status(200).json(prods);
    })
    .catch(err=>{
        console.log(err);
    })
};
    

