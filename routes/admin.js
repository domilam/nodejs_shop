const path = require('path');
const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/add-product', adminController.addProductCtrl);
router.post('/add-product', adminController.postProductCtrl);
router.get('/products', adminController.listProducts);
router.get('/manage-products', adminController.manageProducts);
router.post('/delete-product', adminController.deleteProduct);
router.get('/edit-product/:prodId', adminController.editProduct);
router.post('/edit-product', adminController.postEditProduct);

module.exports = router;

