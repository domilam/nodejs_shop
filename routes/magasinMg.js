const path = require('path');
const express = require('express');
const magasinCtrl = require('../controllers/magasinControllerMg');
const isAuth = require('../middleware/is-auth');

const rootProject = path.dirname(process.mainModule.filename);

const router = express.Router();

router.get('/cart', isAuth, magasinCtrl.displayCart);
router.post('/add-cart', isAuth, magasinCtrl.addCart);
router.post('/delete', isAuth, magasinCtrl.deleteProdCart);
router.get('/orders', isAuth, magasinCtrl.getOrders);
router.get('/payment', isAuth, magasinCtrl.getPayment);
router.get('/favicon.ico', (req, res) => res.status(204));
router.get('/products/?page', magasinCtrl.listProducts);
router.get('/products', magasinCtrl.listProducts);

router.get('/', magasinCtrl.indexCtrl);


module.exports = router;