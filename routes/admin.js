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
var getChartSales = 'WITH recursive MonthRange AS (SELECT DATE_FORMAT(NOW() ,"%Y-%01-01") AS Months UNION ALL SELECT Months + interval 1 MONTH FROM MonthRange'
    + ' WHERE Months < DATE_FORMAT(NOW() ,"%Y-%12-01"))'
    + ' SELECT   (monthname(Months))  as Months, COALESCE (SUM(oi.quantity),0) AS Monthlyqty, COALESCE (ROUND(SUM(price * oi.quantity),2),0)  AS MonthlySale FROM MonthRange'
    + ' LEFT JOIN orders o ON monthname(o.order_date) = monthname(Months)'
    + ' LEFT JOIN order_items oi ON o.id = oi.order_id'
    + ' LEFT JOIN products p ON p.id = oi.product_id '
    + ' AND YEAR(o.order_date) = YEAR(current_date()) '
    + ' GROUP BY monthname(Months) '
    + ' ORDER BY Month(Months);';
  
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
        }, function (callback) {
            connection.query(getChartSales, getMonth, function (err, rows5) {
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
            console.log(callbackResults[4]);
            res.render('admin', {
                earningsM: callbackResults[2],
                earningsY: callbackResults[3],
                sales: callbackResults[1],
                userCount: callbackResults[0],
                ChartCount: callbackResults[4]
            });
        }
    });

   
});

module.exports = router;
