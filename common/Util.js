/**
 * Created by Administrator on 2016/10/5 0005.
 */

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
            console.log('getEntityInstance: %s-%s', key, val);
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

module.exports = Util;