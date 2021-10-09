const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var session = require('express-session');
const flash = require('express-flash');
 
var connection = require('./routes/connection');
const registerRouter = require('./routes/register');
const profileRouter = require('./routes/profile');
const loginRouter = require('./routes/login');
const adminRouter = require('./routes/admin');

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
//Use js file in routes folder to handle endpoints requests 
app.use('/login', loginRouter);
app.use('/register', registerRouter); 
app.use('/profile', profileRouter);
app.use('/admin', adminRouter);

app.set('view engine', 'ejs');
app.use(flash());


app.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('session');
    res.redirect('/');
});


app.get('/', (req, res) => {
        res.render('home');
}); 



var server = app.listen(3000,  () => {
    var port = server.address().port
    console.log('App listening at port: %s', port)
})