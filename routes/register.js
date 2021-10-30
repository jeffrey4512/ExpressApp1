'use strict';
var express = require('express');
var router = express.Router();
var connection = require('./connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var sql = require('./sql');
var getUser = sql.getUser;
var addUser = sql.addUser;

router
    .route('/')
    .get((req, res) => {
        res.render('register');
    })
    .post((req, res) => {
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        connection.query(getUser, [email], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.render('register', { message: 'Email already exist!' , success : false});

            } else { 
                bcrypt.genSalt(saltRounds, (err, salt) => {
                    if (err) throw errl;
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw errl;
                        connection.query(addUser, [name, email, hash], function (err, result) {
                            if (err) throw err;
                            res.render('register', { message: 'Account created successfully!', success: true });
                        });
                    });
                });
            }
        });
    });

module.exports = router;