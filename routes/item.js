'use strict';
var express = require('express');
var router = express.Router({mergeParams: true});
const axios = require('axios');
var connection = require('./connection');
var async = require('async');
var sql = require('./sql');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false })); // To handle HTTP POST requests
router.use(express.json()); // To handle incoming json request  
var getProductDetailsByID = sql.getProductDetailsByID;
var getUserID = sql.getUser;
var getProdReview = sql.getProductReviews;
router
    .route('/')
    .get((req, res) => {
        var name = req.session.name;  
        async.parallel([
            function (callback) {
                connection.query(getProductDetailsByID, req.params.itemId, (err, rows1) => {

                    if (err) {
                        return callback(err);
                    }
                    return callback(null, rows1);
                });
            }, function (callback) {
                connection.query(getProdReview, req.params.itemId, (err, rows2) => {
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
                res.render('item', {
                    item: callbackResults[0][0],
                    reviews: callbackResults[1],
                    name: name
                });
            }
        });

        /*

        axios({
          method: 'get',
          url: 'https://rajschoolproj.herokuapp.com/products/' + req.params.itemId
        })
        .then(function (response) {
          console.log(response.data);
          res.render('item', { item: response.data , name : name});
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          // always executed
        });
        */
    })
    .post((req, res) => {
        var email = req.session.email;
        var qty = req.body.itemQuantity;
        var prod_id = req.body.prod_id;
        var user_id; 


        connection.query(getUserID, email, (err, result) => {

            if (err) {
                throw err;
            } else {
                user_id = result[0].id;
                axios.post('https://rajschoolproj.herokuapp.com/add_to_cart/', {
                    user_id: user_id,
                    cart_items: [{
                        quantity: qty,
                        product_id: prod_id
                    }]
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    console.log(response.data);
                    res.redirect('/item/2');
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                })
            }
        })

        
       
    })
module.exports = router;