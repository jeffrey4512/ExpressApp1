'use strict'; 
var mysql = require('mysql2');

var connection = mysql.createConnection({
    host: '96.9.210.178',
    user: 'root',
    password: 'NUSTIC2601',
    database: 'TIC2601'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to DB Server!');
});

module.exports = connection;
