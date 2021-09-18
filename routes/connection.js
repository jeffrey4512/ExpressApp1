'use strict'; 
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'tic2601.cucypdge4cbr.ap-southeast-1.rds.amazonaws.com',
    user: 'admin',
    password: 'NUSTIC2601',
    database: 'TIC2601'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to DB Server!');
});

module.exports = connection;
