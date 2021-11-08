'use strict';
var express = require('express');
var router = express.Router();
var connection = require('./connection');
var sql = require('./sql');
var async = require('async'); 
var getCartitems = sql.getCartitems;
var getCartDetails = sql.getCartDetails;
var getCartID = sql.getCartID;
var delCartItem = sql.delCartItem;
var updateitemQty = sql.updateitemQty;
var axios = require('axios');
router
    .route('/')
    .get(async (req, res) => {

        if (req.session.loggedin) {

            var name = req.session.name;
            var email = req.session.email;

            async.parallel([
                function (callback) {
                    connection.query(getCartitems, email, (err, rows1) => {
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
    });


router.post('/purchaseorder', (req, res) => {
    var email = req.session.email; 
    var name = req.session.name;
    connection.query(getCartID, email, (err, rowResult) => {
        if (err) {
            throw err;
        } else {
            const apiServer = "https://rajschoolproj.herokuapp.com/checkout_cart/"
            const url = apiServer + rowResult[0].id;
            axios.post(url)
                .then((respond) => {
                    console.log(respond);
                    res.render('cart', { name: name, cartItems: {}, cartDetails: {}, success: true, message: "Cart has been processed successfully!" });
                }).catch((error) => {
                    res.render('cart', { name: name, cartItems: {}, cartDetails: {}, success: false, message: "Cart has failed to processed!" });
                }); 
            }   
    });
  
});



router.post('/removecartitem', (req, res) => {
    var email = req.session.email;
    connection.query(delCartItem, [req.body.id], (err, result) => {
       
        if (err) throw err;
        if (result.affectedRows > 0) {

            async.parallel([
                function (callback) {
                    connection.query(getCartitems, email, (err, rows1) => {
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
                    var returndata = { success: true, message: "Cart item has been removed.", class: "alert alert-success", cartItems: callbackResults[0], cartDetails: callbackResults[1][0] };
                    res.send(JSON.stringify(returndata));
                }
            });


           
        }
    });

   
});




router.post('/updateqty', (req, res) => {
    var email = req.session.email;
    var CartitemID = req.body.itemID;
    var qty = req.body.qty;
    
    connection.query(updateitemQty, [qty,CartitemID], (err, result) => {

        console.log(result);
        if (err) throw err;
        if (result.affectedRows > 0) {

            async.parallel([
                function (callback) {
                    connection.query(getCartitems, email, (err, rows1) => {
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
                    var returndata = { cartItems: callbackResults[0], cartDetails: callbackResults[1][0] };
                    res.send(JSON.stringify(returndata));
                }
            });



        }
    });
     

});









 
module.exports = router;
