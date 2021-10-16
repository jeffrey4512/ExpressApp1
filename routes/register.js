'use strict';
var express = require('express');
var router = express.Router();
var connection = require('./connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;

 

router
    .route('/')
    .get((req, res) => {
        res.render('register');
    })
    .post((req, res) => {
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        console.log("email: ", email, " | name : ", name);
        let sql = 'select * from user where email = ?';

        connection.query(sql, [email], (error, results, fields) => {
            if (results.length > 0) {
                res.render('register', { message: 'Email already exist!' , success : false});

            } else {
                let sqlInsert = 'INSERT INTO user (name, email,password,admin_privilege,created_on,status) VALUES (?,?,?,0,NOW(),"active")';
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