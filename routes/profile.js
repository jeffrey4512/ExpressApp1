'use strict';
var express = require('express');
var router = express.Router();
var connection = require('./connection');
var getUser = 'SELECT * FROM user WHERE email = ?';
var closeUser = 'UPDATE user set status = "inactive" WHERE email = ?';
var updateUser = 'UPDATE user set mobile = ? , address = ? , zipcode = ?  WHERE email = ?';
router.get('/',(req, res) => {
        if (req.session.loggedin) {
            connection.query(getUser, [req.session.email], (err, result) => {
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

router.get('/closeAcct', (req, res) => {
    var email = req.session.email;
    connection.query(closeUser, [email], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
           console.log("Record update: " + result.affectedRows);
            } else {
                console.log("Fail to delete record");
            }
        }); 
        res.redirect("/logout");
    });

router.post('/save', (req, res) => {
    var email = req.session.email;
    var gender = req.body.gender;
    var address = req.body.address;
    var zipcode = req.body.zipcode;
    var mobile = req.body.mobile;
    console.log("Gender : ", gender, " | address : ", address, " | zipcode : ", zipcode, " | mobile : ", mobile);
    /*
    connection.query(updateUser, [address, zipcode, mobile, email], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            console.log("Record update: " + result.affectedRows);
        } else {
            console.log("Fail to delete record");
        }
    });

  res.render("/");
    */
  
});



module.exports = router;
 
