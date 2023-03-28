var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var uploadRouter = require('./routes/upload');
var testAPIRouter = require('./routes/testAPI');

global.__basedir = __dirname;

const db = require("./sequelize.js");
db.sequelize.sync().then(() => {
  console.log(`Database & tables created! (unless table already existed)`);
});

var app = express();

var corsOptions = {
  origin: "http://localhost:9000"
};

app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// This line allows the public files to be read from/rendered by path in the front end
app.use(express.static(path.join(__dirname, 'public')));

app.use("/upload", uploadRouter);
app.use("/testAPI", testAPIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
app.set('port', process.env.PORT || 9000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
