'use strict';
var express = require('express');
var async = require('async');
var router = express.Router();
var connection = require('./connection');
var getUserCount = 'SELECT COUNT(*) AS userCount FROM users';
var getTotalSales = 'SELECT SUM(quantity) AS sales FROM order_items';
var getSales = 'SELECT SUM(totalcost) as totalEarnings, sum(totalQty) as totalSale FROM('
    + ' SELECT SUM(oi.quantity) as totalQty, SUM(price * oi.quantity) AS totalcost FROM order_items oi'
    + ' INNER JOIN orders o ON o.id = oi.order_id'
    + ' INNER JOIN products p ON p.id = oi.product_id  '
    + ' WHERE order_date >= ? AND order_date < (LAST_DAY(CURDATE()) + INTERVAL 1 DAY)'
    + ' GROUP BY oi.product_id) AS T;';
var getMonth = { toSqlString: function () { return '(LAST_DAY(CURDATE()) + INTERVAL 1 DAY - INTERVAL 1 MONTH)'; } };
var getYear = { toSqlString: function () { return 'DATE_FORMAT(NOW() ,"%Y-%01-01")'; } };
 
  
router.get('/', (req, res) => { 
    async.parallel([
        function (callback) { 
            connection.query(getUserCount, function (err, rows1) {
                if (err) {
                    return callback(err);
                }
                return callback(null, rows1[0].userCount);
            });
        },
        function (callback) {
            connection.query(getTotalSales, function (err, rows2) {
                if (err) {
                    return callback(err);
                }
                return callback(null, rows2[0].sales);
            });
        },
        function (callback) {
            connection.query(getSales,getMonth, function (err, rows3) {
                if (err) {
                    return callback(err);
                }
                return callback(null, rows3[0].totalEarnings);
            });
        },
        function (callback) {
            connection.query(getSales, getYear, function (err, rows4) {
                if (err) {
                    return callback(err);
                }
                return callback(null, rows4[0].totalEarnings);
            });
        }
    ], function (error, callbackResults) {
        if (error) {
            console.log(error);
        } else {
            res.render('admin', {
                earningsM: callbackResults[2],
                earningsY: callbackResults[3],
                sales: callbackResults[1],
                userCount: callbackResults[0]
            });
        }
    });

   
});

module.exports = router;
