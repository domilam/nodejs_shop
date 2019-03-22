const nodemailer = require('nodemailer'); /* package to manage a nodemaileer */


const mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-9sf1g.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;
const stripeKey = require("stripe")(process.env.STRIPE_KEY);

const sequelizeKey = {user: process.env.SQL_USER, pwd: process.env.SQL_PASSWORD};
const sessionSecret = '81,O@H!R>9>Xe&G';
const transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.ionos.fr",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
    }
});

module.exports.stripeKey = stripeKey;
module.exports.mongoUrl = mongoUrl;
module.exports.sequelizeKey = sequelizeKey;
module.exports.sessionSecret = sessionSecret;
module.exports.transporter = transporter;