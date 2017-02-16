/**
 * Created by Administrator on 2016/10/5 0005.
 */

    var crypto = require('crypto');
var uuid = require('uuid');
var Result = require('./domain/Result');
var ConstUtil = require('./ConstUtil');

var Util = function(){};

//获取entity实例
Util.getEntityInstance = function(reqBody, entity, isWithId){
    if(!reqBody){
        return entity;
    }
    var _schema = entity.getSchema();
    for(var key in _schema){
        if(key == 'id' && !isWithId){
            continue;
        }
        var val = reqBody[key];
        if(val){
            //根据类型转化
            if(_schema[key].type.toString().indexOf('Number') > 0){
                val = parseFloat(val);
            }
            entity[key] = val ? val : '';
        }
    }
    return entity;
};

//获取entity实例
Util.getQueryInstance = function(reqBody){
    if(!reqBody){
        return null;
    }
    var query = {};
    query.start = reqBody['start'];
    query.limit = reqBody['limit'];
    query.keyword = reqBody['keyword'];
    return query;
};

/**
 * 对于进行异步封装的方法中，在立即返回时，需要有一个延迟，使用该方法
 * @param deferred
 * @param result
 * @param delay  默认20毫秒
 */
Util.setTimeoutReject = function (deferred, result, delay) {
  setTimeout(function () {
      deferred.reject(result);
  }, delay || 20)
};

/**
 * 异步回调的返回的封装
 * @param deferred
 * @param code
 * @param data
 * @param msg
 */
Util.resolveWithResult = function (deferred, code, data, msg) {
    deferred.resolve(new Result({
        code: code,
        data: data,
        msg: msg || ''
    }));
};

/**
 * 异步回调的返回的封装
 * @param deferred
 * @param code
 * @param err
 * @param msg
 */
Util.rejectWithResult = function (deferred, code, err, msg) {
    deferred.reject(new Result({
        code: code,
        error: err,
        msg: msg
    }));
};

/**
 * 处理分页的工具
 * @param query
 * @param isPaging
 * @returns {*}
 */
Util.pageCtrl = function (query, isPaging) {
    if(isPaging == undefined){
        isPaging = true;
    }
    if(!query){
        query = {};
    }
    if(isPaging){
        if(query.start == undefined || isNaN(query.start)){
            query.start = ConstUtil.__PAGE_START__;
        }
        if(query.limit == undefined || isNaN(query.limit)){
            query.limit = ConstUtil.__PAGE_LIMIT__;
        }
        //如果start 、limit不是數字
        query.start = parseInt(query.start);
        query.limit = parseInt(query.limit);
    }else{
        delete query.start;
        delete query.limit;
    }

    return query;
};

/**
 * 检查手机号码格式是否正确
 * @param phone
 */
Util.checkPhone = function (phone) {
    if(!phone){
        return false;
    }
    //不是字符串
    if(!Util.isString(phone)){
       return false;
    }
    var reg = /^1[3-8]\d{9}$/gi;
    return reg.test(phone);
};


/**
 * 检查邮件格式是否正确
 * @param email
 */
Util.checkEmail = function (email) {
  if(!email){
      return false;
  }
  if(!Util.isString(email)){
      return false;
  }
    var reg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]{2,4}$/gi;
  //var reg = /^[\w\d_\.\-]+@\w+\.\w+$/gi;
  return reg.test(email);
};

/**
 * 检查字符串是否为空
 * @param value
 */
Util.checkNull = function (value) {
    return value == undefined || value == false || value == '' || value == null;
};

/**
 * 根据传人的字符串和正则表达式进行校验
 * @param value
 * @param reg
 */
Util.checkRegexp = function (value, reg) {
  if(!value){
      return false;
  }
  return reg.test(value);
};


/**
 * 判断传入的值是否为字符串
 * @param value
 * @returns {boolean}
 */
Util.isString = function (value) {
    return (typeof value) == 'string';
};

/**
 * 判断传入的值是否为数组
 * @param value
 * @returns {boolean}
 */
Util.isArray = function (value) {
  return Object.prototype.toString.call(value)  == '[object Array]';
};

/**
 * 判断传入的值是否为函数
 * @param value
 * @returns {boolean}
 */
Util.isFunction = function(value){
    return Object.prototype.toString.call(value) == '[Object Function]';
};

/**
 * 判断传入的值是否为正则表达式
 * @param value
 * @returns {boolean}
 */
Util.isRegExp = function (value) {
    return Object.prototype.toString.call(value) == '[Object RegExp]';
};

/**
 * md5加密
 * @param str
 * @returns {*}
 */
Util.md5 = function (str) {
    if(!str || !Util.isString(str)){
        return '';
    }
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
};

/**
 * 获取基于时间的uuid
 * @returns {*}
 */
Util.getUuid = function () {
    return Util.getUuidV1();
};
/**
 * 获取基于时间的uuid
 * @returns {*}
 */
Util.getUuidV1 = function () {
    return uuid.v1();
};

/**
 * 随机的uuid值
 * @returns {*}
 */
Util.getUuidV4 = function () {
    return uuid.v4();
};

/**
 * 数组中是否包含某个值
 * @param arr
 * @param val
 */
Util.isArrayContains = function (arr, val) {
    if(!arr || !Util.isArray(arr) || !val){
        return false;
    }
    for(var i = 0, len = arr.length; i < len; i++){
        if(arr[i] == val){
            return true;
        }
    }
    return false;
};

module.exports = Util;
