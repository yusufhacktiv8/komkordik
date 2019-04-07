var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var fileUpload = require('express-fileupload');

var index = require('./routes/index');
var users = require('./routes/users');
var usersByRole = require('./routes/users_by_role');
var changePassword = require('./routes/change_password');
var roles = require('./routes/roles');
var security = require('./routes/security');
var departments = require('./routes/department');
var departmentsAll = require('./routes/department_all');
var competencies = require('./routes/competency');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use('/', index);
app.use('/api/users', users);
app.use('/api/usersbyrole', usersByRole);
app.use('/api/changepassword', changePassword);
app.use('/api/roles', roles);
app.use('/api/security', security);
app.use('/api/departments', departments);
app.use('/api/alldepartments', departmentsAll);
app.use('/api/competencies', competencies);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.error(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
