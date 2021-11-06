'use strict';  
var express = require('express');
var router = express.Router();
var connection = require('./connection');
var async = require('async');
var sql = require('./sql');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false })); // To handle HTTP POST requests
router.use(express.json()); // To handle incoming json request
var addProduct = sql.addProduct;
var getProductName = sql.getProductName;
var getProductDetails = sql.getProductDetails;
var updateProductDetails = sql.updateProductDetails;
var deleteProduct = sql.deleteProduct;
router
    .route('/')
    .get((req, res) => {
        connection.query(getProductName, (err, result) => {
            res.render('products', { productList: result });
        });
    })
    .post((req, res) => {
        var productname = req.body.product;
        var price = req.body.price;
        var quantity = req.body.quantity;
        var image = req.body.image;
        var category = req.body.category;
        var summary = req.body.summary;

        connection.query(addProduct, [productname, category, summary, price, quantity, image], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.render('products', { message: 'Product already exist!', success: false });

            } else {
                if (err) throw err;
                res.render('products', { message: 'Product created successfully!', success: true });
            }
        });
    });

router.get('/getproduct', async (req, res) => {
    async.parallel([
        function (callback) {
            connection.query(getProductDetails, req.query.productSelected,  (err, rows1) => {
                
                if (err) {
                    return callback(err);
                }
                return callback(null, rows1);
            });
        }
    ], function (error, callbackResults) {
        if (error) {
            console.log(error);
        } else { 
            res.send(JSON.stringify(callbackResults[0]));
        }
    });
});

router.post('/updateproduct', (req, res) => {

    connection.query(updateProductDetails, [req.body.summary, req.body.price, req.body.quantity, req.body.image, req.body.productSelected],  (err, result) => {
        if (err) throw err;
        console.log(result);
        if (result.affectedRows > 0) {
            var returndata = { success: true, message: "Product has been updated.", class: "alert alert-success" };
          
            res.send(JSON.stringify(returndata));
        } else {
            var returndata = { success: false, message: "Update failed.", class: "alert alert-danger" };
            res.send(JSON.stringify(returndata));
        }
    }); 

});


router.post('/deleteproduct', (req, res) => {

    connection.query(deleteProduct, [req.body.productSelected], (err, result) => {
        
        if (err) throw err; 
        if (result.affectedRows > 0) {
                var returndata = { success: true, message: "Product has been deleted.", class: "alert alert-success"};
                res.send(JSON.stringify(returndata));
        } else {
           
                var returndata = { success: false, message: "Product delete failed.", class: "alert alert-danger" };
                res.send(JSON.stringify(returndata));
           
           
        }
    });

});
module.exports = router;
