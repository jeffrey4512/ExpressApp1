const path = require('path');

const { promisify } = require('util');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var session = require('express-session');
const flash = require('express-flash');
var connection = require('./routes/connection');

app.use(bodyParser.urlencoded({ extended: false })); // To handle HTTP POST requests
app.use(express.json()); // To handle incoming json request

const registerRouter = require('./routes/register');
const profileRouter = require('./routes/profile');
const loginRouter = require('./routes/login');
const adminRouter = require('./routes/admin');
const reportRouter = require('./routes/report');
const productsRouter = require('./routes/products');

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: false
}));

//Use js file in routes folder to handle endpoints requests 
app.use('/login', loginRouter);
app.use('/register', registerRouter); 
app.use('/profile', profileRouter);
app.use('/admin', adminRouter);
app.use('/admin/report', reportRouter);
app.use('/admin/products', productsRouter);

app.set('view engine', 'ejs');
app.use(flash());


app.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('session');
    res.redirect('/');
});
 

app.get('/', (req, res) => {
    var name = req.session.name; 
    res.render('home', {
        name: name
    });
}); 


var server = app.listen(3000,  () => {
    var port = server.address().port
    console.log('App listening at port: %s', port)
})
 