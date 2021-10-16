'use strict';
var express = require('express');
var router = express.Router();
var connection = require('./connection');
 
var getUser = 'SELECT * FROM users WHERE email = ?';
var closeUser = 'UPDATE users set status = "inactive" WHERE email = ?';
var updateUser = 'UPDATE users set mobile = ? , address = ? , zipcode = ? , gender = ?  WHERE email = ?';
router.get('/', (req, res) => {
    if (req.session.loggedin) {

        connection.query(getUser, [req.session.email], (err, result) => {
            if (err) {
                throw err;
            } else {
                
                res.render('profile', {
                    name: req.session.name,
                    gender: result[0].gender,
                    mobile: result[0].mobile,
                    address: result[0].address,
                    zipcode: result[0].zipcode
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

router.post('/update', (req, res) => {
    var email = req.session.email;
    var gender = req.body.gender;
    var address = req.body.address;
    var zipcode = req.body.zipcode;
    var mobile = req.body.mobile;
  
    connection.query(updateUser, [mobile, address, zipcode, gender, email], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) { 
            console.log("Record update: " + result.affectedRows);
            connection.query(getUser, [req.session.email], (err, result) => {
                if (err) {
                    throw err;
                } else {

                    res.render('profile', {
                        message: 'Update successful!',
                        success: true,
                        name: req.session.name,
                        gender: result[0].gender,
                        mobile: result[0].mobile,
                        address: result[0].address,
                        zipcode: result[0].zipcode
                    });
                }
            });
            
        } else {
            console.log("Fail to delete record");
            res.render('profile', { message: 'Update Fail!', success: false, name: req.session.name });
        }
    });
     
  
});



module.exports = router;
 
