/**
 * team模块测试用例
 * Created by Administrator on 2016/12/31.
 */
var request = require('superagent');
var expect = require('chai').expect;

describe('team模块测试用例', function () {
    it('获取team列表', function(done){
        request.post('http://localhost:3001/team/getTeamList').end(function(err, res){
            expect(res.code).to.be.equal(0);
            done();
        });
    });
});