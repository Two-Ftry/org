/**
 * @desc log4js工具类
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/23.
 */
var fs = require('fs');
var path = require('path');
var log4js = require('log4js');

var defaultLogger = 'logInfo';

var configFile = process.env.NODE_ENV ? '-' + process.env.NODE_ENV : '';
var config;
try{
  config = require('../config/log4js' + configFile + '.json');
}catch(e){
  config = require('../config/log4js.json');
}

var helper = {};

//在日志目录不存在的情况下，创建日志目录
var appenders = config.appenders;
for(var i = 0, len = appenders.length; i < len; i++){
  var filename = appenders[i].filename;
  if(filename && appenders[i].type != 'console'){
    var baseDir = appenders[i].baseDir || config.baseDir;
    appenders[i].filename = baseDir + appenders[i].filename;
    var filepath = path.resolve(baseDir, filename);
    var filedir = path.dirname(filepath);
    var filedirs = filedir.split(path.sep);
    var _fileTemp = '';
    if(process.platform != 'win32'){
      _fileTemp = path.sep;
    }
    //逐层创建日志目录
    for(var j = 0, jLen = filedirs.length; j < jLen; j++){
      if(j == 0){
        if(process.platform != 'win32'){
          _fileTemp += path.sep + filedirs[j];
        }else{
          _fileTemp += filedirs[j];
        }
      }else{
        _fileTemp += path.sep + filedirs[j];
      }

      if(!fs.existsSync(_fileTemp)){
        fs.mkdirSync(_fileTemp);
      }
    }
  }
}

log4js.configure(config);

var logDebug = log4js.getLogger('logDebug');
var logInfo = log4js.getLogger('logInfo');
var logWarn = log4js.getLogger('logWarn');
var logError = log4js.getLogger('logError');

helper.debug = function(){
  logDebug.debug(_getMsg(arguments));
};

helper.info = function(){
  logInfo.info(_getMsg(arguments));
};

helper.warn = function(){
  logWarn.warn(_getMsg(arguments));
};

helper.error = function(){
  logError.error(_getMsg(arguments));
};

helper.getLogger = function(name){
  name = name ? name : defaultLogger;
  var logger = log4js.getLogger(name);
  if(!logger){
    logger = log4js.getLogger(defaultLogger);
  }
  return logger;
};

/* 内部方法 */
function _getMsg(args){
  var r = '';
  for(var i = 0, len = args.length; i < len; i++){
    if(i != 0){
        r += ' - ';
    }
    var arg = args[i];
    if(Object.prototype.toString.call(arg) == '[object String]'){
      r += arg;
    }else{
      r += JSON.stringify(arg);
    }
  }
  return r;
}

module.exports = helper;
