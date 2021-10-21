'use strict';
var express = require('express');
var router = express.Router();
var connection = require('./connection');
var getUserCount = 'SELECT COUNT(*) AS userCount FROM users';
var getTotalSales = 'SELECT SUM(quantity) AS sales FROM order_items';
var getMonthlySales = 'SELECT SUM(totalcost) as MonthlyEarnings, sum(Monthlyqty) as MonthlySale FROM('
    + ' SELECT SUM(oi.quantity) as Monthlyqty, SUM(price * oi.quantity) AS totalcost FROM order_items oi'
    + ' INNER JOIN orders o ON o.id = oi.order_id'
    + ' INNER JOIN products p ON p.id = oi.product_id  '
    + ' WHERE order_date >= ? AND order_date < (LAST_DAY(CURDATE()) + INTERVAL 1 DAY)'
    + ' GROUP BY oi.product_id) AS T;';
var getMonth = { toSqlString: function () { return '(LAST_DAY(CURDATE()) + INTERVAL 1 DAY - INTERVAL 1 MONTH)'; } };
var getYear = { toSqlString: function () { return 'DATE_FORMAT(NOW() ,"%Y-%01-01")'; } };
 
  
router.get('/', (req, res) => {
    connection.query(getTotalSales,  (err, result) => {
        if (err) throw err; 
        if (result.length) {
            connection.query(getMonthlySales, [getMonth],  (err, subresult) => {
                if (err) throw err; 
                if (result.length) {
                    connection.query(getUserCount, (err, subresult2) => {
                        connection.query(getMonthlySales,[getYear], (err, subresult3) => {


                            res.render('admin', {
                                earningsM: subresult[0].MonthlyEarnings,
                                earningsY: subresult3[0].MonthlyEarnings,
                                sales: result[0].sales,
                                userCount: subresult2[0].userCount
                            });
                        });

                        
                    });



                }
            }); 
        }
    }); 
});

module.exports = router;
