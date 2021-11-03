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
 
router.get('/',  (req, res) => {
    try { 
        res.render('products'); 
    } catch (err) {
        res.status(500).send('Something went wrong');
    }
});
 
module.exports = router;
