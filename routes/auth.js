const path = require('path');
const express = require('express');
const authController = require('../controllers/authController_prod');
const {check, body} = require('express-validator/check');

const router = express.Router();

// router.get('/login', loginController.getLoginCtrl);
router.post('/login', [
                        check('emailLogin')
                        .isEmail()
                        .withMessage('Merci de saisir un email valide !')
                        .normalizeEmail(),
                        body('pwdLogin')
                        .isLength({min: 8}).withMessage('Le mot de passe doit avoir un minimum de 8 caractères !')
                        .trim()
                        ], authController.postLoginCtrl);
router.get('/logout', authController.getLogoutCtrl);
router.post('/signup',[
                        check('emails')
                        .isEmail()
                        .withMessage('Merci de saisir un email valide !')
                        .normalizeEmail(),
                        body('pwds')
                        .isLength({min: 8})
                        .withMessage('Le mot de passe doit avoir un minimum de 8 caractères !')
                        .trim(),
                        body('confpwds')
                        .custom((value, { req }) => {
                            if (value !== req.body.pwds){
                                throw new Error('Les mots de passe ne correspondent pas !');
                            }
                            return true;
                        })
                        .trim()
                    ], authController.postSignupCtrl);
                        
router.get('/reset-password', authController.resetPassword);
router.post('/postResetPassword', [
                                    check('emailrp')
                                    .isEmail()
                                    .withMessage('Merci de saisir un email valide !')
                                    .normalizeEmail(),
                                    ],authController.postResetPassword);
router.get('/reset/:token', authController.getResetPassword);
router.post('/post-new-password', [
                                    body('password')
                                    .isLength({min: 8})
                                    .withMessage('Le mot de passe doit avoir un minimum de 8 caractères !')
                                    .trim()
                                    ], authController.postNewPassword);

module.exports = router;

