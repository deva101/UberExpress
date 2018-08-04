const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const bodyParser = require('body-parser');
const mongoose  = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

// Connect to Database
mongoose.connect('mongodb://localhost:27017/uber',{ useNewUrlParser: true },function (err,result) {
    console.log("Database Connected...");
});

// Router--- will direct incoming trafic to specific location
const indexRouter = require('./routes/indexR');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// To read post method body data
  app.use(bodyParser.json());
// Session
  app.use(cookieParser());
// Session initialize
  app.use( session({
      secret: 'anystringoftext',
      saveUninitialized: false,
      resave: false
  }));
// use connect-flash for flash messages
  app.use( flash() );






// Route the request
indexRouter(app);

// Custom Error Handling
app.use( (err,req,res,next)=>{
    console.log(err," From app.js");

    // res.status(422)
    //    .send({ error:err.message});


});







// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




app.listen(3050,function () {
   console.log("Application running @ http://localhost:3050/")
});
module.exports = app;
