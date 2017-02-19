/**
 * @desc log4js工具类
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/23.
 */

var log4js = require('log4js');

var defaultLogger = 'logDebug';

var configFile = process.env.NODE_ENV ? '-' + process.env.NODE_ENV : '';
var config;
try{
  config = require('./log4js' + configFile + '.json');
}catch(e){
  config = require('./log4js.json');
}

var helper = {};

//TODO，在日志目录不存在的情况下，创建日志目录

log4js.configure(config);

var logDebug = log4js.getLogger('logDebug');
var logInfo = log4js.getLogger('logInfo');
var logWarn = log4js.getLogger('logWarn');
var logError = log4js.getLogger('logError');

helper.debug = function(msg){
  logDebug.debug(msg);
};

helper.info = function(msg){
  logInfo.info(msg);
};

helper.warn = function(msg){
  logWarn.warn(msg);
};

helper.error = function(msg){
  logError.error(msg);
};

helper.getLogger = function(name){
  name = name ? name : defaultLogger;
  var logger = log4js.getLogger(name);
  if(!logger){
    logger = log4js.getLogger(defaultLogger);
  }
  return logger;
};

module.exports = helper;
