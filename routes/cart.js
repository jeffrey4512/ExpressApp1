'use strict';
var express = require('express');
var router = express.Router();
var connection = require('./connection');
var sql = require('./sql');
var getUser = sql.getUser;
var getCartitems = sql.getCartitems;


router
    .route('/')
    .get((req, res) => {
        if (req.session.loggedin) {
            var name = req.session.name;
            var email = req.session.email;
            connection.query(getCartitems, [email], (err, result) => {
                res.render('cart', { name: name, cartItems: result });
            });
        } else {
            res.send('Please login to view this page!');
        }
        
    })
    .post((req, res) => {
      
    });
module.exports = router;
