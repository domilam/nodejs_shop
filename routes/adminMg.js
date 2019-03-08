const path = require('path');
const express = require('express');
const adminController = require('../controllers/adminControllerMg');
const isAuth = require('../middleware/is-auth');
const {check, body} = require('express-validator/check');


const router = express.Router();

router.get('/add-product', isAuth, adminController.addProductCtrl);
router.post('/add-product', [check('nom')
                            .isLength({min: 3})
                            .withMessage('Le nom doit contenir minimum 3 caractères !'),
                            check('prix')
                            .isFloat()
                            .withMessage('Le prix doit être un nombre décimal')
                            ],isAuth, adminController.postProductCtrl);
router.get('/manage-products', isAuth, adminController.manageProducts);
router.get('/manage-products/?page', adminController.manageProducts);

router.delete('/delete-product/:prodId', isAuth, adminController.deleteProduct);
router.get('/edit-product/:prodId', isAuth, adminController.editProduct);
router.post('/edit-product', [check('nom')
                            .isLength({min: 3})
                            .withMessage('Le nom doit contenir minimum 3 caractères !'),
                            check('prix')
                            .isFloat()
                            .withMessage('Le prix doit être un nombre décimal')
                            ],isAuth, adminController.postEditProduct);


module.exports = router;

