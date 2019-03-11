//rename this file databaseSeq.js

const Sequelize = require('sequelize');
const sequelize = new Sequelize('magasin', '', '',{ // add your ident and password sql database
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

module.exports = sequelize;