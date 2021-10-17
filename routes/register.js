'use strict';
var express = require('express');
var router = express.Router();
var connection = require('./connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var getUser = 'select * from users where email = ?';
 

router
    .route('/')
    .get((req, res) => {
        res.render('register');
    })
    .post((req, res) => {
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        connection.query(getUser, [email], (error, results, fields) => {
            if (results.length > 0) {
                res.render('register', { message: 'Email already exist!' , success : false});

            } else {
                let sqlInsert = 'INSERT INTO users (name, email,password,admin_privilege,status) VALUES (?,?,?,0,"active")';
                bcrypt.genSalt(saltRounds, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        connection.query(sqlInsert, [name, email, hash], function (err, result) {
                            if (err) throw err;
                            console.log('1 record inserted');
                            res.render('register', { message: 'Account created successfully!', success: true });
                        });
                    });
                });


              
            }
        });
    });

module.exports = router;