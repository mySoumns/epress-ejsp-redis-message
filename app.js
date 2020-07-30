const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

// cookie session 中间件
const cookieParser = require('cookie-parser');
const session = require('express-session')

// 引入路由中间件
const indexRouter = require('./routes/index');
const entriesRouter = require('./routes/entries');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
// 用户数据中间间
const user = require('./middleware/user');

const app = express();

// 视图配置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));

// 消息体格式处理
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie session 使用
app.use(cookieParser());
app.use(session({
  secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
  cookie: { maxAge: 20 * 60 * 1000 }, //cookie生存周期20*60秒
  resave: true, //cookie之间的请求规则,假设每次登陆，就算会话存在也重新保存一次
  saveUninitialized: true //强制保存未初始化的会话到存储器
}));

// 静态文件路径处理
app.use(express.static(path.join(__dirname, 'public')));
//获取登录用户数据
app.use(user);

// 路由处理
app.use(indexRouter);
app.use(entriesRouter);
app.use(registerRouter);
app.use(loginRouter);

// catch 404 and forward to error handler 404 处理
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler 500处理
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
