const path = require('path');
const rootProject = path.dirname(process.mainModule.filename);
const User = require('../models/userMg');
const bcryptjs = require('bcryptjs'); /* package to crypt a password */
const crypto = require('crypto'); /* package to create a token */
require('datejs');
const nodemailer = require('nodemailer'); /* package to manage a nodemaileer */
const sgTransport = require('nodemailer-sendgrid-transport'); /* package to manage sendgrid with nodemailer */
const transporter = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: ''
    }
}));
const { validationResult } = require('express-validator/check');

exports.postLoginCtrl = (req, res, next) => {
    const email = req.body.emailLogin;
    const password = req.body.pwdLogin;

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log('uuuuuuuuu'+errors.array().find((el)=>{
            return el.param === 'emails';
        }));
        console.log(errors.array());
        res.locals.isHide = false;
        return res.status(422).render('index.ejs', {
                path: '/',
                countProduct: 0,
                errorMessage: errors.array(),
                hide: true,
                validationErrors: errors.array(),
                oldRegistration: {
                    // username: username,
                    email: email,
                    password: password,
                    // confirmPassword: confirmPassword
                }
            });
        
    }


    User.findUserByEmail(email)
    .then(userFinded => {
        if(!userFinded){
            req.flash('error', 'Invalid user.');
            return res.redirect('/');
        }
        bcryptjs.compare(password, userFinded.password)
        .then(matchPwd => {
            if (matchPwd){
                req.session.isAuthenticated = true;
                req.session.user = userFinded;

                return req.session.save((err) => {
                    console.log(err);
                    res.redirect('/');
                });
            }
            req.flash('error', 'Invalid password.');
            res.redirect('/');
        })
        .catch(err=>{
            console.log(err);
            res.redirect('/');
        })
    })
};

exports.getLogoutCtrl = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    })
};

exports.postSignupCtrl = (req, res, next) => {
    const username = req.body.usernames;
    const email = req.body.emails;
    const password = req.body.pwds;
    const confirmPassword = req.body.confpwds;
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log('uuuuuuuuu'+errors.array().find((el)=>{
            return el.param === 'emails';
        }));
        console.log(errors.array());
        return res.status(422).render('index.ejs', {
                path: '/',
                countProduct: 0,
                errorMessage: errors.array(),
                hide: false,
                validationErrors: errors.array(),
                oldRegistration: {
                    username: username,
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword
                }
            });
        
    }
    bcryptjs.hash(password, 12)
    .then(hashedPassword => {
        User.findUserByEmail(email)
        .then(userFinded => {
            console.log('************************'+userFinded);
            if (userFinded){
                console.log('yeah');
                req.flash('error', 'Cet utilisateur existe déjà');
                return res.redirect('/');
            }
            const user = new User(username,email,hashedPassword, undefined, undefined, {items: []},);
            transporter.sendMail({
                to: email,
                from: 'dominique.lameynardie@laposte.net',
                subject: "Validation d'inscription",
                html: '<h1>Vous êtes inscrit chez Bricoflex Shop</h1>'
            })
            .then(result => {
                return user.save();
            })
            .then(result => {
                req.flash('error', 'Vous êtes maintenant inscrit !!');
                return res.redirect('/');
            })
            .catch(err=> console.log(err));

        })
        .catch(err => console.log(err));
    })
    .catch(err=>console.log(err));
};

exports.resetPassword = (req, res, next) => {
    req.resetHide = false;
    res.locals.resetHide = req.resetHide;
    // const errors = validationResult(req);
    // const email = req.body.email;
    // if (!errors.isEmpty()){
    //     console.log(errors.array()[0]);
    //     return res.status(422).render('index.ejs', {
    //             path: '/',
    //             countProduct: 0,
    //             errorMessage: errors.array()[0].msg,
    //             hide: false,
    //             oldRegistration: {
    //                 email: email,
    //             }
    //         });
        
    // }
    let flash = req.flash('error');
    let errorMessage = flash.length == 0 ? [] : flash;
    // let errorMessage = req.flash('error');
    // if (errorMessage.length == 0){
    //     errorMessage = null;
    // }
    if (!req.session.user){
        countProduct = req.countProduct;

    }else{
        countProduct = req.user.countProduct();
    }

    res.render('index', {
        path: '/',
        countProduct: countProduct,
        errorMessage: errorMessage,
        hide: true,
        validationErrors: [],

        oldRegistration: {}
    });
}

exports.postResetPassword = (req, res, next) => {
    const emailrp = req.body.emailrp;
    console.log('****************email: '+emailrp);
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors.array()[0]);
        res.locals.resetHide = false;
        return res.status(422).render('index.ejs', {
                path: '/',
                countProduct: 0,
                errorMessage: errors.array(),
                hide: true,
                validationErrors: errors.array(),

                oldRegistration: {
                    email: emailrp
                }
            });
    }
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }
        const token = buffer.toString('hex');
        User.findUserByEmail(emailrp)
        .then(userFetched => {
            if (!userFetched){
                req.flash('error', "Cette utilisateur n'existe pas");
                return redirect('/');
            }
            console.log(Date.today());
            console.log(Date.today().addHours(6));
            let dateTest = Date.today();
            let dateExpire = Date.today().addHours(1);
            console.log(dateTest);
            console.log(dateExpire);

            let user = new User(
                userFetched.username,
                userFetched.email,
                userFetched.password,
                token,
                dateExpire,
                userFetched.cart,
                userFetched._id.toString()
            );
            transporter.sendMail({
                to: emailrp,
                from: 'dominique.lameynardie@laposte.net',
                subject: "Réinitialisation de mot de passe",
                html: `
                <h1>
                    Cliquez sur ce 
                    <a href="http://localhost:4000/reset/${token}">lien</a>
                     pour réinitialiser votre mot de passe</h1>
                `
            })

            return user.update();
        })
        .then(result => {
            console.log('result: '+result);


            req.flash('error', 'Un lien de réinitialisation vous a été envoyé !');
            return res.redirect('/');
        }).catch(err => console.log(err));
    });
}

exports.getResetPassword = (req, res, next) => {
    const token = req.params.token;
    console.log('tok:'+token);
    User.findUserByToken(token)
    .then(user => {
        console.log(user.token);
        if (!user) {
            req.flash('error', 'Token not found');
            return res.redirect('/');
        }

        let errorMessage = req.flash('error');
        if (errorMessage.length == 0){
            errorMessage = null;
        }
        if (!req.session.user){
            countProduct = req.countProduct;
    
        }else{
            countProduct = req.user.countProduct();
        }
        res.render('admin/init-new-password', {
            path: '/init-password',
            countProduct: countProduct,
            errorMessage: errorMessage,

            userId: user._id,
            hide: true,
            validationErrors: [],

            oldRegistration: []
        });
    })
    .catch(err => console.log(err));
}

exports.postNewPassword = (req, res, next) => {
    const password = req.body.password;
    const userId = req.body.userId;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()){
        console.log(errors.array()[0]);
        return res.status(422).render('index.ejs', {
                path: '/',
                countProduct: 0,
                errorMessage: errors.array(),
                hide: false,
                validationErrors: errors.array(),

                oldRegistration: {
                    password: password,
                }
            });
    }
    bcryptjs.hash(password, 12)
    .then(hashedPassword => {
        User.findUserById(userId)
        .then(userFinded => {
            if (!userFinded) {
                req.flash('error', 'Utilisateur non trouvé');
                return res.redirect('/');
            }
            user = new User(
                userFinded.username,
                userFinded.email,
                hashedPassword,
                undefined,
                undefined,
                userFinded.cart,
                userFinded._id.toString());
            return user.update();
        })
        .then(result => {
            req.flash('error', 'Mot de passe modifié');
            console.log('xxxxxxxxxxxxxxxxxx'+ errors.array());
            res.redirect('/');
            // res.render('index.ejs', {
            //     path: '/',
            //     countProduct: 0,
            //     errorMessage: !errors.isEmpty() ? errors.array()[0].msg : '',
            //     hide: true,
            //     oldRegistration: {}
            // });;
        })
    })
    .catch(err => console.log(err));
}

