'use strict';
var express = require('express');
var router = express.Router();
var connection = require('./connection');

router.get('/',(req, res) => {
        if (req.session.loggedin) {
            connection.query('SELECT * FROM user WHERE email = ? ', [req.session.email], function (err, result, fields) {
                if (err) {

                    throw err;
                } else {
                    res.render('profile', {
                        name: result[0].name,
                        gender: result[0].gender,
                        mobile: result[0].mobile
                    });
                }
            });
        } else {
            res.send('Please login to view this page!');
        }
    });

router.get('/deleteAcct', (req, res) => {
    var email = req.session.email;
    console.log("Deleting Email : ", email);

    /*
    connection.query('DELETE FROM user WHERE email = ?', [email], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
           console.log("Number of records deleted: " + result.affectedRows);
            } else {
                console.log("Fail to delete record");
            }
        });
        */
        res.redirect("/logout");
    });

module.exports = router;
 
