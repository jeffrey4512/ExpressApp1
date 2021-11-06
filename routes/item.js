'use strict';
var express = require('express');
var router = express.Router({mergeParams: true});
const axios = require('axios');

router
    .route('/')
    .get((req, res) => {

        axios({
          method: 'get',
          url: 'https://rajschoolproj.herokuapp.com/products/' + req.params.itemId
        })
        .then(function (response) {
          console.log(response.data);
          res.render('item', { item: response.data});
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          // always executed
        });
    })
    .post((req, res) => {
      axios({
        method: 'post',
        url: 'https://rajschoolproj.herokuapp.com/add_to_cart',
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