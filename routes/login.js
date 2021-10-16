'use strict';
var express = require('express');
var router = express.Router();
var connection = require('./connection');

const bcrypt = require('bcrypt');


router
    .route('/')
    .get((req, res) => {
    if (req.session.loggedin) {
        res.redirect('/profile');
    } else {
        res.render('login');
    }
    })
    .post((req, res) => {
    var email = req.body.email;
    var plainpassword = req.body.password;

    connection.query('SELECT name,email,password,admin_privilege FROM user WHERE email = ?', [email], (err, result) => {

        if (result.length > 0) {
            bcrypt.compare(plainpassword, result[0].password, (err, compareResult) => {
                if (compareResult) {
                    req.session.loggedin = true;
                    req.session.email = email;
                    req.session.name = result[0].name;
                    if (result[0].admin_privilege == 0) {
                        res.redirect('/profile');
                    } else {
                        res.redirect('/admin');
                    }
                } else {
                    res.render('login', {
                        error: 'Incorrect Username and/or Password!'
                    });
                }
            });
        } else {
            res.render('login', {
                error: 'Incorrect Username and/or Password!'
            });
        }
    });
});
 
router.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
module.exports = router;
