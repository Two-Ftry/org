/**
 * team模块测试用例
 * Created by Administrator on 2016/12/31.
 */
var request = require('superagent');
var expect = require('chai').expect;
var agent = request.agent();

var cookie;

describe('team模块测试用例', function () {
    before(function(done){
        request.post('http://localhost:3001/user/login')
            .send({email: '1307516522@qq.com', password: '123456'})
            .end(function(err, res){
                cookie = res.headers['set-cookie'];
                done();
            });

    });
    it('获取team列表', function(done){
        console.log(cookie[0]);
        request.post('http://localhost:3001/team/getTeamList')
            .set('set-cookie', cookie[0])
            .send({start: 0, limit: 10})
            .end(function(err, res){
                console.log(res.body.msg);
                expect(res.body.code).to.be.equal(0);
                done();
            });
    });
});