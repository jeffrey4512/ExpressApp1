const path = require('path');
const {    promisify, } = require('util');

const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
var session = require('express-session');  
const flash = require('express-flash');
var connection = require('./routes/connection');

const registerRouter = require('./routes/register');
const passport = require('passport');
const bcrypt = require('bcrypt');
const initializePassport = require('./passport-config');
var loginRouter = require('./routes/login');
const { resolve } = require('url');


app.use(bodyParser.urlencoded({ extended: false })); // To handle HTTP POST requests
app.use(bodyParser.json());
app.use(express.json()); // To handle incoming json request
app.use(express.static(__dirname + '/public'));
app.use('/register', registerRouter); //Use register.js file in routes folder to handle endpoints requests that starts with /register

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

   
app.get('/', (req, res) => {
    console.log(req.session.loggedin);
    if (req.session.loggedin) {
        res.redirect('/welcome');

    } else {

        res.render('login');

    }
});

 
app.get('/welcome', (req, res) =>  {
    if (req.session.loggedin) { 
      connection.query('SELECT * FROM user WHERE email = ? ' , [req.session.email], function (err, result, fields) {
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



app.get('/logout', (req, res,next) => {

    console.log('before Session : ', req.session.loggedin);
    req.session.destroy();
    res.clearCookie('session'); 
    res.redirect('/');
});




app.post('/', (req, res) =>  {
    var email = req.body.email;
    var plainpassword = req.body.password;

    
        connection.query('SELECT email,password FROM user WHERE email = ?   ', [email], function (error, results, fields) {
            
            if (results.length > 0) {
                bcrypt.compare(plainpassword, results[0].password, (err, compareResult) => {
                    if (compareResult) { 
                        req.session.loggedin = true;
                        req.session.email = email;
                        res.redirect('/welcome');
                    } else { 
                        res.render('login', { error: 'Incorrect Username and/or Password!' });
                    }
                    
                });
               
            } else {   
               res.render('login', {error: 'Incorrect Username and/or Password!' });
            }
        });
   
});


app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
    
});
 
var server = app.listen(3000, function () { 
    var port = server.address().port

    console.log('App listening at port: %s',   port)
})