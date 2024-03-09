require('dotenv').config()
require('express-async-errors');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const toobusy = require("toobusy-js");
const { rateLimit } = require("express-rate-limit")


const apiRouter = require('./router');

global.__basedir = __dirname;

const { sequelize } = require("./sequelize.js");
sequelize.sync({ alter: false }).then(() => {
  console.log(`Database & tables created! (unless table already existed)`);
});

var app = express();


const limiter = rateLimit({
  windowMs: 5000,
  limit: 100,
  statusCode: 429,
  standardHeaders: false,
  legacyHeaders: false
})

app.use(limiter);


app.use((req, res, next) => {
  if(toobusy()) {
    next(createError(503));
  } else {
    next();
  }
})



// view engine setup
app.use(cors());
app.use(hpp());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// This line allows the public files to be read from/rendered by path in the front end
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(helmet());


app.use(helmet.contentSecurityPolicy({
  useDefaults: false,
  directives: {
    "default-src": "none"
  }
}));

app.use(helmet.frameguard({
  action: "deny"
}));


// Routes for querying data
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  const res_status = err.status || 500;
  res.status(res_status);
  res.json({ error: {
    status: err.status || 500,
    message: err.message,
    debugMessage: req.app.get('env') === 'development' ? err.debugMessage : ""
  }})
});



// module.exports = app;
app.set('port', process.env.PORT || 9000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});