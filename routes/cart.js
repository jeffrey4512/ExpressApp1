'use strict';
var express = require('express');
var router = express.Router();
var connection = require('./connection');
var sql = require('./sql');
var async = require('async'); 
var getCartitems = sql.getCartitems;
var getCartDetails = sql.getCartDetails;
var axios = require('axios');
router
    .route('/')
    .get(async (req, res) => { 

        if (req.session.loggedin) {
           /*
            axios.get('https://rajschoolproj.herokuapp.com/carts/6')
                .then((res) => {
                    console.log(res.data);
                    // Code for handling the response
                })
                .catch((error) => {

                    // Code for handling the error
                })
                */
            var name = req.session.name;
            var email = req.session.email;

            async.parallel([
                function (callback) {
                    connection.query(getCartitems, email,  (err, rows1) => {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, rows1);
                    });
                }, function (callback) {
                    connection.query(getCartDetails, email, (err, rows2) => {

                        if (err) {
                            return callback(err);
                        }
                        return callback(null, rows2);
                    });
                }
            ], function (error, callbackResults) {
                if (error) {
                    console.log(error);
                } else {
                    res.render('cart', {
                        name: name,
                        cartItems: callbackResults[0],
                        cartDetails: callbackResults[1][0]
                    });
                }
            });

             
        } else {
            res.send('Please login to view this page!');
        }
        
    })
    .post((req, res) => {
      
    });


router.post('/purchaseorder', (req, res) => {
    var email = req.session.email; 
    

    axios.post('https://rajschoolproj.herokuapp.com/carts/checkout_cart/6')
        .then((res) => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        });


});

module.exports = router;
