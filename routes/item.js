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
      axios({
        method: 'post',
        url: 'https://rajschoolproj.herokuapp.com/add_to_cart/',
        params: {
          user_id: "402",
          cart_items:[ {
            quantity: 1,
            product_id: 3
          }]
      },
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
    })
module.exports = router;