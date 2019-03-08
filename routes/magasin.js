const path = require('path');
const express = require('express');
const magasinCtrl = require('../controllers/magasinController');

const rootProject = path.dirname(process.mainModule.filename);

const router = express.Router();

router.get('/cart', magasinCtrl.displayCart);
router.post('/add-cart', magasinCtrl.addCart);
router.get('/', magasinCtrl.indexCtrl);


module.exports = router;