var User = require('../models/User');
var passport = require('passport');
var passportConfig = require('../config/passport');


exports.register = function (req, res, next) {
    if (req.user) return res.redirect('/users/' + req.user.username);
    res.render('main/authentication/register', {errors: req.flash('errors'),layout: 'authen-layout'});
};

exports.getLogin = function (req, res, next) {
    if (req.user) return res.redirect('/users/' + req.user.username);
    res.render('main/authentication/login', {messages: req.flash('loginMessage'), layout: 'authen-layout'});
};

exports.postLogin = passport.authenticate('local-login', {
    successRedirect: '/products',
    failureRedirect: '/login',
    failureFlash: true
});

exports.logout = function(req, res, next) {
    req.logout();
    res.redirect('/');
};