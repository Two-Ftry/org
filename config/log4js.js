/**
 * @desc log4js配置文件
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/23.
 */

var log4js = require('log4js');

log4js.configure({
    appenders: [
        {
            type: 'console',
            category: 'consoleLogger'
        },
        {
            type: 'file',
            filename: 'log/log.js',
            pattern: '-yyyy-MM-dd',
            maxLogSize: 10240,
            category: 'dateFileLogger'
        }
    ],
    replaceConsole: true,
    levels: {
        consoleLogger: 'debug',
        dateFileLogger: 'debug'
    }
});

var consoleLogger = log4js.getLogger('consoleLogger');
var dateFileLogger = log4js.getLogger('dateFileLogger');

exports.logger = dateFileLogger;