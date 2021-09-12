const path = require('path');
const {    promisify, } = require('util');

const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 

var session = require('express-session'); 
const mysql = require('mysql');
const flash = require('express-flash');

const passport = require('passport');
const bcrypt = require('bcrypt');
const initializePassport = require('./passport-config');
var loginRouter = require('./routes/login');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false })); // To handle HTTP POST requests
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(flash()); 
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true
}));

const connection = mysql.createConnection({
    host: 'tic2601.cucypdge4cbr.ap-southeast-1.rds.amazonaws.com',
    user: 'admin',
    password: 'NUSTIC2601',
    database: 'TIC2601'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to DB Server!');
});

   
app.get('/', (req, res) => {
    res.render('login');
});

 
app.get('/welcome', (req, res) =>  {
    if (req.session.loggedin) { 
      connection.query("SELECT * FROM user WHERE email = ? " , [req.session.email], function (err, result, fields) {
                if (err) throw err;
          if (err) {

              throw err;
          } else {
                
              res.render('welcome', {
                  name: result[0].name
              });

                }
      });
        
    } else {
        res.send('Please login to view this page!');
    } 
});




app.get('/register',  (req, res) => {
    res.render('register');
}); 

app.post('/', (req, res) =>  {
    var email = req.body.email;
    var password = req.body.password;
    console.log('email : ', email);
    if (email && password) {
        connection.query('SELECT * FROM user WHERE email = ? ', [email], function (error, results, fields) {
            
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.email = email; 
                res.redirect('/welcome');
            } else {  
              //   res.redirect('/' );
               res.render('login', {error: 'Incorrect Username and/or Password!' });
            }
            res.end();
        });
    } else {
        console.log('Please enter Username and Password!');
        res.end();
    }
});
 
  

app.post("/register", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    console.log("name : ", name, " password : ", password); 
    let sql = 'select * from user where email = ?';
  
    connection.query(sql, [email], (error, results, fields) => {
        console.log(results.length);
        if (results.length > 0) {
            res.render('register', { error: 'Email already exist!' });

        } else {
            let sqlInsert = "INSERT INTO user (name, email,password) VALUES (?,?,?)";
            connection.query(sqlInsert, [name,email,password], function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                res.render('register', { error: undefined , success: 'successful' });
            });
        }
    }); 
})
 

app.use(  (req, res, next) => {
    res.locals.session = req.session;
    next();
    
});
 
var server = app.listen(3000, function () { 
    var port = server.address().port

    console.log("App listening at %s",   port)
})