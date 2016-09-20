var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressHbs = require('express-handlebars');
var methodOverride = require('method-override');

var configDatabase = require('./config/database');
var shopMiddleWare = require('./middleware/shop');

var indexRoutes = require('./routes/index');
var categoryRoutes = require('./routes/shop/category');
var productRoutes = require('./routes/shop/product');
var orderRoutes = require('./routes/shop/order');
var userRoutes = require('./routes/authentication/user');
var saleRoutes = require('./routes/shop/sales');

mongoose.connect(configDatabase.url, function () {
  console.log('Connected to database');
});

var app = express();

// view engine setup
app.engine('.hbs', expressHbs({
  defaultLayout: 'layout',
  extname: '.hbs',
  helpers: {
    equal: function(lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if( lvalue!=rvalue ) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));


app.use(shopMiddleWare.getAllCategories);
app.use(shopMiddleWare.getAllProducts);

app.use(categoryRoutes);
app.use(productRoutes);
app.use(orderRoutes);
app.use(userRoutes);
app.use(indexRoutes);
app.use(saleRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
