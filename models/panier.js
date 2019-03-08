const Sequelize = require('sequelize');
const sequelize = require('../util/databaseSeq');

const Panier = sequelize.define('panier',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    date: Sequelize.DATE
})

module.exports = Panier;