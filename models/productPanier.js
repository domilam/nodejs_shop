const Sequelize = require('sequelize');
const sequelize = require('../util/databaseSeq');

const ProductPanier = sequelize.define('productPanier',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantite:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = ProductPanier;