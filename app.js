var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var cors = require('cors')
var usersRouter = require('./routes/users');
var jwt = require('jsonwebtoken')
var app = express();
var helmet = require('helmet');
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
//跨域请求处理
// app.use("*", function (req, res, next) {
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Origin", req.headers.origin);
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   if (req.method == 'OPTIONS') {
//     res.send(200); // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
//   }
//   else {
//     next();
//   }
// });
app.use(helmet());
// //启用cors
app.use(cors({
  origin: ['http://127.0.0.1:8080'],
  methods: ['GET', 'POST'],
  credentials:true,
  alloweHeaders: ['Conten-Type', 'x-access-token']
}));
//校验token是否正确
app.use(function (req, res, next) {
  //校验token过滤登录注册页
  console.log(req.get("Cookie"))
  if (req.url == "/login") {
    next()
  } else {
    //校验token
   
    jwt.verify(req.get("Set-Token"), "lyhq", function (err, decode) {
      if (err) {  //校验token失败    
        res.send({ code: 401, message: "没有权限" });
      } else {
        next()
      }
    })
  }
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
