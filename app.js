/**
 * @desc 入口文件
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/23.
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var log4js = require('log4js');
var fs = require('fs');

//解析post请求数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//处理cookie
app.use(cookieParser());

//记日志
var logDirectory = __dirname + '/log';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var logger = require('./config/log4js.js').logger;
app.use(log4js.connectLogger(logger, {level: 'auto', format:':method :url'}));

//路由配置
var orgRouter = require('./routes/org.router');
app.use('/org', orgRouter);

//404错误处理
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//处理错误-（错误中间件）
app.use(function (err, req, res, next) {
    logger.error('Something go wrong', err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;