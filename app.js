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
var glob = require('glob');
var path = require('path');
var ConstUtil = require('./common/ConstUtil');
var Util = require('./common/Util');
var url = require('url');

//MongoDB session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var dbConfig = require('./config/dbConfig');

//建立数据库连接
var DaoUtil = require('./common/DaoUtil');
var connection = DaoUtil.createConnection();

//解析post请求数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//处理cookie
app.use(cookieParser());

//记日志
var logDirectory = __dirname + '/log';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var logger = require('./config/log4js.js').getLogger();
app.use(log4js.connectLogger(logger, {level: 'auto', format:':method :url'}));

//use MongoDB session
app.use(session({
    secret: dbConfig.secret,
    key: dbConfig.db,
    cookie: {
        maxAge: 1000*60*60*24*30
    },
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: connection
    })
}));

//路由前置中间件
var unloginRouter = require('./config/UnloginRouter.config');
app.use(function (req, res, next) {
    var routerPath = url.parse(req.url).path;
    console.log('routerPath', routerPath);
    if(!Util.isArrayContains(unloginRouter, routerPath)){
        var userInfo = req.session[ConstUtil.__USER_INFO__];
        if(!userInfo){
            res.status(200);
            res.json({
                code: 100,
                msg: 'you are not login'
            });
            return;
        }
    }
    next();
});

//路由配置(自动读取，不需要每次都配置)
var files = glob.sync('./routes/**.router.js');
files.forEach(function(filePath){
    var filename = filePath.replace(path.dirname(filePath), '');
    var filenamePrefix = filename.replace('.router.js', '');
    app.use(filenamePrefix, require(filePath));
});

//404错误处理
app.use(function(req, res, next) {
    var err = new Error('404 Not Found');
    err.status = 404;
    next(err);
});

//处理错误-（错误中间件）
app.use(function (err, req, res, next) {
    logger.error('Something go wrong', err);
    res.status(err.status || 500);
    //res.render('error', {
    //    message: err.message,
    //    error: {}
    //});
    res.json({
        error: {},
        message: err.message
    });
});

module.exports = app;
