/**
 * Created by Administrator on 2016/10/5 0005.
 */
var Code = require('./Code');

var Result = function (obj) {
    if(obj){
        this.code = obj.code ? obj.code : Code.__SUCCESS__;
        this.msg = obj.msg ? obj.msg: '';
        this.error = obj.error;
        this.data = obj.data;
    }
};

module.exports = Result;