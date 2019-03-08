const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const magasinRoutes =  require('./routes/magasin');

const sequelize = require('./util/databaseSeq');
const Product = require('./models/product');
const User = require('./models/user');
const Panier = require('./models/panier');
const ProductPanier = require('./models/productPanier');

User.hasOne(Panier);
Panier.belongsTo(User);

Panier.belongsToMany(Product, {through: ProductPanier});
Product.belongsToMany(Panier, {through: ProductPanier});


const app = express();
//set engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', magasinRoutes);
app.use('/admin', adminRoutes);

sequelize.sync()
.then((result)=>{
    console.log(result);
    return User.findByPk(1)
})
.then((user)=>{
    if (!user){
        User.create({nom: 'Dominique', email: 'dom.lam@gmail.com'});
    }
    app.listen(4000);
    
})
.catch(err=>{
    console.error('Unable to connect to the database: ', err);
});
