'use strict';
var express = require('express');
var router = express.Router();
var connection = require('./connection');
var sql = 'SELECT SUM(item_quantity) AS sales FROM order_item';

function getMonthlysales(callback) {
    connection.query('SELECT SUM(item_quantity) AS sales FROM order_item', function (err, result) {
        if (err) throw err;
        if (result.length) {
            return ( result[0].sales);
        }

    });
}
 

router.get('/', (req, res) => {
    var sales = getMonthlysales();
    res.render('admin', {
      
        earningsM: '$20000',
        earningsY: '$40000',
        sales: '50'
    });
});

module.exports = router;
