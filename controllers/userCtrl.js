var User = require('../models/User');
var Cart = require('../models/Cart');
var async = require('async');
var Order = require('../models/Order');

exports.getAllUsers = function (req, res, next) {
    User.find({}, function (err, users) {
        if (err) return next(err);
        res.json(users);
    });
};

exports.getUser = function (req, res, next) {
    Order.find({user_id: req.user._id}).sort({date: -1}).exec(function (err, orders) {

        for (var i = 0; i < orders.length; i++) {
            if (orders[i].state === 'Processing') {
                orders[i].isProcessing = true;
            }
        }
        res.render('main/authentication/user', {orders: orders});
    });
};

exports.createUser = function (req, res, next) {
   if (req.body.password !== req.body.confirmPassword) {
       req.flash('errors', 'Password did not match');
       return res.redirect('/register');
   }

    async.waterfall([
        function (callback) {
            var newUser = new User();
            newUser.username = req.body.username;
            newUser.email = req.body.email;
            newUser.password = req.body.password;

            User.find({$or: [{username: req.body.username}, {email: req.body.email}]}, function (err, existingUsers) {
                if (err) return next(err);
                if (existingUsers.length > 0) {
                    req.flash('errors', 'Username or Email already taken');
                    return res.redirect('/register');
                }

                newUser.save(function (err) {
                    if (err) return next(err);
                    callback(null, newUser);
                });

            });
        },

        function (newUser) {
            var cart = new Cart();
            cart.owner = newUser._id;
            cart.save(function (err) {
                if (err) return next(err);
                req.logIn(newUser, function(err) {
                    if (err) return next(err);
                    res.redirect('/profile');
                });
            });
        }
    ]);
};



exports.updateUser = function (req, res, next) {
    User.findOneAndUpdate({username: req.params.username}, req.body, {new: true, upsert: true}, function (err, user) {
        if (err) return next(err);
        res.json(user);
    });
};

exports.deleteUser = function (req, res, next) {
    User.findOneAndRemove({username: req.params.username}, function (err) {
        if (err) return next(err);
        res.json({msg: 'Successfully delete user'});
    });
};