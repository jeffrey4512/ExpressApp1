'use strict';
const moment = require('moment');

var express = require('express');
var router = express.Router();
var connection = require('./connection');
var getUsers = 'SELECT  u.name,u.email,u.mobile,u.gender,u.status,u.created_at, COUNT(o.user_id) as count_order FROM users u'
    + ' LEFT JOIN orders o ON u.id = o.user_id'
    + ' GROUP BY u.name;';
var getTotalSales = 'SELECT SUM(quantity) AS sales FROM order_items';
var getMonthlySales = 'SELECT SUM(totalcost) as MonthlyEarnings, sum(Monthlyqty) as MonthlySale FROM('
    + ' SELECT SUM(oi.quantity) as Monthlyqty, SUM(price * oi.quantity) AS totalcost FROM order_items oi'
    + ' INNER JOIN orders o ON o.id = oi.order_id'
    + ' INNER JOIN products p ON p.id = oi.product_id  '
    + ' WHERE order_date >= (LAST_DAY(CURDATE()) + INTERVAL 1 DAY - INTERVAL 2 MONTH) AND order_date < (LAST_DAY(CURDATE()) + INTERVAL 1 DAY)'
    + ' GROUP BY oi.product_id) AS T;';
  
router.get('/', (req, res) => {
  

    connection.query(getUsers, [req.session.email], (err, result) => {
        if (err) {
            throw err;
        } else {
           // console.log(result);
            res.render('report', {
                name: req.session.name,
                userList: result,
                moment: moment
            });
        }
    });
});

module.exports = router;
