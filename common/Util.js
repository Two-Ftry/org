/**
 * Created by Administrator on 2016/10/5 0005.
 */

var Util = function(){};

//获取entity实例
Util.getEntityInstance = function(reqBody, entity){
    if(!reqBody){
        return entity;
    }
    var _schema = entity.getSchema();
    for(var key in _schema){
        if(key == 'id'){
            continue;
        }
        var val = reqBody[key];
        entity[key] = val ? val : '';
        console.log('getEntityInstance: %s-%s', key, val);
    }
    return entity;
};

module.exports = Util;