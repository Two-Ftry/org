/**
 * @desc log4js配置文件
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/23.
 */

var log4js = require('log4js');

var defaultLogger = 'logDate';

var configFile = process.env.NODE_ENV ? '-' + process.env.NODE_ENV : '';
var config;
try{
  config = require('./log4js' + configFile + '.json');
}catch(e){
  config = require('./log4js.json');
}

log4js.configure(config);

var consoleLogger = log4js.getLogger('consoleLogger');
var dateFileLogger = log4js.getLogger('dateFileLogger');

var getLogger = function(name){
  name = name ? name : defaultLogger;
  var logger = log4js.getLogger(name);
  if(!logger){
    logger = log4js.getLogger(defaultLogger);
  }
  return logger;
};

module.exports = {
  getLogger: getLogger
};
