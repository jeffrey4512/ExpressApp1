'use strict';
var express = require('express');
var async = require('async');
var router = express.Router();
var connection = require('./connection');
var sql = require('./sql');
var getMonth = { toSqlString: function () { return '(LAST_DAY(CURDATE()) + INTERVAL 1 DAY - INTERVAL 1 MONTH)'; } };
var getYear = { toSqlString: function () { return 'DATE_FORMAT(NOW() ,"%Y-%01-01")'; } };
var getUserCount = sql.getUserCount;
var getTotalSales = sql.getTotalSales;
var getSales = sql.getSales;
var getChartSales = sql.getChartSales;

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
            connection.query(getSales, getMonth, function (err, rows3) {
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
            res.render('admin', {
                earningsM: callbackResults[2],
                earningsY: callbackResults[3],
                sales: callbackResults[1],
                userCount: callbackResults[0],
                ChartCount: callbackResults[4],
                name: req.session.name
            });
        }
    });

   
});

module.exports = router;
