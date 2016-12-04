/**
 * @desc 连接数据库工具类
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/27.
 */

var mongoose = require('mongoose');

var dbConfig = require('../config/dbConfig');

var connectionUrl = 'mongodb://' + dbConfig.userName + ':' + dbConfig.pwd + '@'
    + dbConfig.ip　+':' + dbConfig.port + '/'
    + dbConfig.db + '?authSource=' + dbConfig.db + '';


var DaoUtil = function () {
};

//创建一个单例连接
DaoUtil.createConnection = function () {
    if(!DaoUtil.connection){
        DaoUtil.connection = mongoose.createConnection(connectionUrl);

        DaoUtil.connection.on('error', console.error.bind(console, '连接数据库报错!!!'));
        DaoUtil.connection.on('open', function(){
            console.log('打开数据库连接!!!');
        });
    }
    return DaoUtil.connection;
};

//获取表model
DaoUtil.getModel = function(columnsJson, tableName){
    var Schema = mongoose.Schema;
    var _schema = new Schema(columnsJson);
    if(!DaoUtil.connection){
        console.log('try to create a mongodb connection!!!');
        DaoUtil.createConnection();
    }
    return DaoUtil.connection.model(tableName, _schema);
};

/**
 * 将obj的id，换成_id
 * @param obj
 */
DaoUtil.replaceIdWithUnderlineId = function (obj) {
    if(obj.id){
        obj._id = obj.id;
        delete obj.id;
    }
    return obj;
};


module.exports = DaoUtil;