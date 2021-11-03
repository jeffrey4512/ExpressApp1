'use strict';
const moment = require('moment');
const {
    promisify,
} = require('util');
var express = require('express');
var router = express.Router();
var connection = require('./connection');
var async = require('async');
var sql = require('./sql');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false })); // To handle HTTP POST requests
router.use(express.json()); // To handle incoming json request

var getUsersList = sql.getUsersList;

var getProductReport = sql.getProductReport; // 'SELECT name, quantity, price, category, created_at, updated_at FROM products WHERE created_at >= ? AND created_at <= ? ORDER BY ?? ASC;';
const queryAsync = promisify(connection.query).bind(connection);

router.get('/', async (req, res) => {
    let getusr = {};
    try { 
        getusr = await queryAsync(getUsersList);
        res.render('report', {
            name: req.session.name,
            userList: getusr,
            moment: moment
        }); 
    } catch (err) {
        console.log('SQL error', err);
        res.status(500).send('Something went wrong');
    }
});


router.get('/update', async (req, res) => {
 
    async.parallel([
        function (callback) {
            connection.query(getProductReport, [req.query.fromtime, req.query.totime, req.query.optionFilter], function (err, rows1) {
               
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

module.exports = router;
