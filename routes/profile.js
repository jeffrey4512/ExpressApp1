'use strict';
const moment = require('moment');
var async = require('async');
var express = require('express');
var router = express.Router();
var connection = require('./connection');
var sql = require('./sql');
var getUser = sql.getUser;
var closeUser = sql.closeUser;
var updateUser = sql.updateUser;
var getOrderCount = sql.getOrderCount;
var getOrderDetails = sql.getOrderDetails;
var getBookmarks = sql.getBookmarks; 
var getReviews = sql.getReviews;

router.get('/', (req, res) => {
    if (req.session.loggedin) {
        async.parallel([
            function (callback) {
                connection.query(getUser, req.session.email, function (err, rows1) {
                    if (err) {
                        return callback(err);
                    } 
                    return callback(null, rows1);
                });
            },
            function (callback) {
                connection.query(getOrderCount, req.session.email, function (err, rows2) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, rows2);
                });
            },
            function (callback) {
                connection.query(getOrderDetails, req.session.email, function (err, rows3) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, rows3);
                });
            },
            function (callback) {
                connection.query(getBookmarks, req.session.email,   function (err, rows4) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, rows4);
                });
            }, function (callback) {
                connection.query(getReviews, req.session.email, function (err, rows5) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, rows5);
                });
            }
        ], function (error, callbackResults) { 
            if (error) {
                console.log(error);
            } else {
                res.render('profile', {
                    moment: moment,
                    name: req.session.name,
                    gender: callbackResults[0][0].gender,
                    mobile: callbackResults[0][0].mobile,
                    address: callbackResults[0][0].address,
                    zipcode: callbackResults[0][0].zipcode,
                    orderList: callbackResults[1],
                    orderDetails: callbackResults[2],
                    bookmarks: callbackResults[3],
                    reviews: callbackResults[4]
                });
            }
        });

    } else {
        res.send('Please login to view this page!');
    } 
});


router.post('/update', (req, res) => {
    var email = req.session.email;
    var gender = req.body.gender;
    var address = req.body.address;
    var zipcode = req.body.zipcode;
    var mobile = req.body.mobile;
    connection.query(updateUser, [mobile, address, zipcode, gender, email], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            console.log("Record update: " + result.affectedRows);
            async.parallel([
                function (callback) {
                    connection.query(getUser, req.session.email, function (err, rows1) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, rows1);
                    });
                },
                function (callback) {
                    connection.query(getOrderCount, req.session.email, function (err, rows2) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, rows2);
                    });
                },
                function (callback) {
                    connection.query(getOrderDetails, req.session.email, function (err, rows3) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, rows3);
                    });
                },
                function (callback) {
                    connection.query(getBookmarks, req.session.email, function (err, rows4) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, rows4);
                    });
                }, function (callback) {
                    connection.query(getReviews, req.session.email, function (err, rows5) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, rows5);
                    });
                }
            ], function (error, callbackResults) {
                if (error) {
                    console.log(error);
                } else {
                    res.render('profile', {
                        moment: moment,
                        name: req.session.name,
                        gender: callbackResults[0][0].gender,
                        mobile: callbackResults[0][0].mobile,
                        address: callbackResults[0][0].address,
                        zipcode: callbackResults[0][0].zipcode,
                        orderList: callbackResults[1],
                        orderDetails: callbackResults[2],
                        reviews: callbackResults[3],
                        bookmarks: callbackResults[4]
                    });
                }
            });
        } else {
            console.log("Fail to update record");
            res.render('profile', { message: 'Update Fail!', success: false, name: req.session.name });
        }
   
    })
});


router.get('/closeAcct', (req, res) => {
    var email = req.session.email;

    connection.query(closeUser, [email], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            console.log("Record update: " + result.affectedRows);
        } else {
            console.log("Fail to delete record");
        }
    });
    res.redirect("/logout");

});

module.exports = router;
 
