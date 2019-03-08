const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); /* to parse body request */
const mongoConnect = require('./util/databaseMongo').mongoConnect;
const session = require('express-session'); /* package to manage session with express */
const MongoDBStore = require('connect-mongodb-session')(session); /* package to manage session with mongodb */
const MONGODB_URI = require('./util/databaseMongo').mongodb_uri;
const getDb = require('./util/databaseMongo').getDb;
const mongoDb = require('mongodb');
const ObjectId = mongoDb.ObjectId;
const csrf = require('csurf'); /* to manage csrf protection */
const flash = require('connect-flash'); /* package to manage message */
const multer = require('multer'); /*multipart package */
const moment = require('moment');



const adminRoutes = require('./routes/adminMg');
const magasinRoutes =  require('./routes/magasinMg');
const authRoutes = require('./routes/auth');
const User = require('./models/userMg');
const magasinCtrl = require('./controllers/magasinControllerMg');
const isAuth = require('./middleware/is-auth');


const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf();
const date = new Date().toISOString().replace(/:/g,'_');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, date + "_" + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};
//set engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use(session({
    secret: '81,O@H!R>9>Xe&G',
    resave: false,
    saveUninitialized: false,
    store: store
}));


app.use(flash());

app.use((req, res, next) => {
    req.isHide = true;
    req.resetHide = true;
    if (!req.session.user){
        return next();
    }
    User.findUserById(req.session.user._id.toString())
    .then(user => {
        if (!user) {
            return next();
        }
        // console.log('+++++++++++++++++++'+user._id);
        req.user = new User(
            user.username,
            user.email,
            user.password,
            user.token,
            user.expireDate,
            user.cart,
            user._id.toString());
        // console.log('---------------------------------'+req.user._id);
        req.countProduct = 0;
        next();
    })
    .catch(err => { 
        throw new Error(err);
        // console.log(err)});
    });
});

app.use((req, res, next) => {
    res.locals.isHide = req.isHide;
    res.locals.resetHide = req.resetHide;
    res.locals.isAuthenticated = req.session.isAuthenticated,
    next();
});
app.post('/addOrder', isAuth, magasinCtrl.addOrder);
app.use(csrfProtection);
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(magasinRoutes);
app.use(authRoutes);
app.use('/500', (req, res, next) => {
    res.status(500).render('error/page500.ejs', {
        path: '/',
        countProduct: 0

    });
});
app.use((req, res, next) => {
    res.status(404).render('error/page404.ejs', {
        path: '/',
        countProduct: 0

    });
})


mongoConnect(() => {
    app.listen(4000);
});
