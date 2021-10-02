const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var session = require('express-session');
const flash = require('express-flash');

const bcrypt = require('bcrypt');
var connection = require('./routes/connection');
const registerRouter = require('./routes/register');
const profileRouter = require('./routes/profile');
var loginRouter = require('./routes/login');


app.use(bodyParser.urlencoded({extended: false})); // To handle HTTP POST requests
app.use(bodyParser.json());
app.use(express.json()); // To handle incoming json request
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.use('/register', registerRouter); //Use register.js file in routes folder to handle endpoints requests that starts with /register
app.use('/profile', profileRouter);
app.set('view engine', 'ejs');

app.use(flash());



app.get('/admin', (req, res) => {
    res.render('admin');
});

app.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.clearCookie('session');
    res.redirect('/');
});


app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/profile');
    } else {
        res.render('login');
    }
});


app.post('/', (req, res) => {
    var email = req.body.email;
    var plainpassword = req.body.password;


    connection.query('SELECT email,password,admin_privilege FROM user WHERE email = ?', [email], (err, result) => {

        if (result.length > 0) {
            bcrypt.compare(plainpassword, result[0].password, (err, compareResult) => {
                if (compareResult) {
                    req.session.loggedin = true;
                    req.session.email = email;

                    if (result[0].admin_privilege == 0) {
                        res.redirect('/profile');
                    } else {
                        res.redirect('/admin');
                    }
                } else {
                    res.render('login', {
                        error: 'Incorrect Username and/or Password!'
                    });
                }
            });
        } else {
            res.render('login', {
                error: 'Incorrect Username and/or Password!'
            });
        }
    });

});


app.use((req, res, next) => {
    res.locals.session = req.session;
    next();

});

var server = app.listen(3000,  () => {
    var port = server.address().port
    console.log('App listening at port: %s', port)
})