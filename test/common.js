/**
 * 获取登录使用的cookie
 * Created by Administrator on 2017/1/6.
 */
var request = require('superagent');
var config = require('./config');
var _cookie;
/**
 * 获取登录cookie
 * @param done
 * @param cb
 */
var getLoginCookie = function(cb){
    if(_cookie){
        cb && cb(_cookie);
    }else{
        request.post( config.__FTRY_HOME__ + 'user/login')
        .send({email: config.__EMAIL__, password: config.__PWD__})
        .end(function(err, res){
            _cookie = res.headers['set-cookie'];
            cb && cb(_cookie);
        });
    }
};

var ftryRequest = {
    post: function(url){
        return request.post(url)
        .set('Cookie', _cookie ? _cookie[0] : '');
    },
    get: function(url){
        return request.get(url)
            .set('Cookie', _cookie ? _cookie[0] : '');
    }
}

module.exports = {
    getLoginCookie: getLoginCookie,
    ftryRequest: ftryRequest
};