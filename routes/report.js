'use strict';
const moment = require('moment');
const {
    promisify,
} = require('util');

var express = require('express');
var router = express.Router();
var connection = require('./connection');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false })); // To handle HTTP POST requests
router.use(express.json()); // To handle incoming json request

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
var sql = 'SELECT name, quantity, price, category, created_at, updated_at FROM products WHERE created_at >= ? AND created_at <= ?';
const queryAsync = promisify(connection.query).bind(connection);
/*
router.get('/', (req, res) => {
    connection.query(getUsers, [req.session.email], (err, result) => {
        if (err) {
            throw err;
        } else { 
            res.render('report', {
                name: req.session.name,
                userList: result,
                moment: moment
            });
        }
    });
});
*/
router.get('/', async (req, res) => {
    let getusr = {};
    let products = {};
    try { 
       getusr = await queryAsync(getUsers);
       products = await queryAsync(sql, [req.query.FromTime, req.query.ToTime]); 
        res.render('report', {
            name: req.session.name,
            userList: getusr,
            moment: moment,
            products: products
        }); 
    } catch (err) {
        console.log('SQL error', err);
        res.status(500).send('Something went wrong');
    }
});

router.get('/update', async (req, res) => {
    console.log("From : ", req.query.FromTime, "To : ", req.query.ToTime);
    res.send('test');
});
module.exports = router;
