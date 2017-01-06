/**
 * team模块测试用例
 * Created by Administrator on 2016/12/31.
 */
var request = require('superagent');
var expect = require('chai').expect;
var agent = request.agent();

var config = require('../config');

var common = require('../common');

describe('team模块测试用例', function () {
    before(function(done){
        //必须调用，用户登录的方法，获取cookie
        common.getLoginCookie(function(c){
            done();
        });

    });
    it('获取team列表', function(done){
        //使用common.ftryRequest代替request，因为在common.ftryRequest设置了登录的cookie
        common.ftryRequest.post(config.__FTRY_HOME__ + 'team/getTeamList')
            .send({start: 0, limit: 10})
            .end(function(err, res){
                expect(res.body.code).to.be.equal(0);
                done();
            });
    });
    it('获取用户信息', function(done){
        common.ftryRequest.post(config.__FTRY_HOME__ + 'user/getUserById')
            .send({id: 'xxx-111'})
            .end(function (err, res) {
               expect(res.body.code).to.be.not.equal(0);
                done();
            });
    })
});