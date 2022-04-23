var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/upload');
var testAPIRouter = require('./routes/testAPI');

global.__basedir = __dirname;

const Sequelize = require('sequelize');

//const myPath = 'mysql://root:root@localhost:3306/comerDb';
//const sequelize = new Sequelize(myPath, { operatorsAliases: false });
// const sequelize = new Sequelize({
//     HOST: "127.0.0.1",
//     USER: "new_user",
//     PASSWORD: "password",
//     DB: "Comer",
//     dialect: "mysql",
//     PORT: 3306,
// });

// const sequelize = new Sequelize('comerDb','root','MyNewPass', { 
//     dialect: 'mysql',
//     host:'localhost'

// });

const db = require("./sequelize.js");
db.sequelize.sync().then(() => {
  console.log(`Database & tables created!`);
});



// const Note = sequelize.define('notes', { note: Sequelize.TEXT, tag: Sequelize.STRING });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

// sequelize.sync({ })
//   .then(() => {
//     console.log(`Database & tables created!`);

//       return Note.findAll().then(function(notes) {
//       console.log(notes);
//     });
//   });



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
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



module.exports = app;
