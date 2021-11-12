const path = require('path');
var sql = require('./routes/sql');
var async = require('async'); 
 
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
const itemRouter = require('./routes/item');
const cartRouter = require('./routes/cart');

var getTop20Product = sql.getTop20Product;
var getCartDetails = sql.getCartDetails;

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
app.use('/item/:itemId', itemRouter);
app.use('/cart', cartRouter);

app.set('view engine', 'ejs');
app.use(flash());

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('session');
    res.redirect('/');
});

app.get('/', async (req, res) => {
    var name = req.session.name;
    var email = req.session.email;
    async.parallel([
        function (callback) {
            connection.query(getTop20Product, req.query.productSelected, (err, rows1) => {

                if (err) {
                    return callback(err);
                }
                return callback(null, rows1);
            });
        }, function (callback) {
            if (req.session.loggedin) {

                connection.query(getCartDetails, email, (err, rows2) => {

                    if (err) {
                        return callback(err);
                    }
                    return callback(null, rows2);
                });
            } else {
                return callback(null, 0);
            }
        }
    ], function (error, callbackResults) {
        if (error) {
            console.log(error);
        } else { 
            res.render('home', {
                name: name,
                cartDetails: callbackResults[1][0],
                productList: callbackResults[0]
            });
        }
    });
});


var server = app.listen(process.env.PORT || 5000, () => {
    var port = server.address().port
    console.log('App listening at port: %s', port)
})
