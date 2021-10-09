'use strict';
var express = require('express');
var router = express.Router();
var connection = require('./connection');
var getTotalSales = 'SELECT SUM(item_quantity) AS sales FROM order_item';
var getMonthlySales = 'SELECT SUM(totalcost) as MonthlyEarnings, sum(Monthlyqty) as MonthlySale FROM ('
    + ' SELECT SUM(oi.item_quantity) as Monthlyqty,SUM(price * item_quantity) AS totalcost FROM order_item oi '
    + ' INNER JOIN orders o ON oi.order_id = o.order_id'
    + ' INNER JOIN product p ON p.product_id = oi.product_id '
    + ' WHERE order_date >= (LAST_DAY(CURDATE()) + INTERVAL 1 DAY - INTERVAL 2 MONTH) AND order_date <  (LAST_DAY(CURDATE()) + INTERVAL 1 DAY)'
    + ' GROUP BY oi.product_id) AS T;';

 

router.get('/', (req, res) => {
    connection.query(getTotalSales, function (err, result) {
        if (err) throw err; 
        if (result.length) {
            connection.query(getMonthlySales, function (err, subresult) {
                if (err) throw err; 
                if (result.length) {
                    res.render('admin', {
                        earningsM: subresult[0].MonthlyEarnings,
                        earningsY: '$20000',
                        sales: result[0].sales
                    });
                }
            }); 
        }
    }); 
});

module.exports = router;
