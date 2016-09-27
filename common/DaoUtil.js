/**
 * @desc 连接数据库工具类
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/27.
 */

var mongoose = require('mongoose');

var __DB_URL__ = '127.0.0.1';

var DaoUtil = function () {

};

DaoUtil.connection = function (tableName) {
    var db = mongoose.createConnection(__DB_URL__, tableName);
    return db;
};




module.exports = DaoUtil;