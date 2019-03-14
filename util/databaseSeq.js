
const Sequelize = require('sequelize');
const sequelizeKey = require('./keys').sequelizeKey;

const sequelize = new Sequelize('magasin', sequelizeKey.user, sequelizeKey.pwd,{
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