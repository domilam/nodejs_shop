const express = require('express');
const apiController = require('../controllers/apiController');

router = express.Router();

router.get('/api/products', apiController.getProducts);

module.exports = router;