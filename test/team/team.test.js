/**
 * team模块测试用例
 * Created by Administrator on 2016/12/31.
 */
var request = require('supertest');
var expect = require('chai').expect;

var config = require('../config');
var common = require('../common');

describe('team testing', function(){
  before(function(done){
      //必须调用，用户登录的方法，获取cookie
      common.getLoginCookie(function(c){
          done();
      });

  });
  it('getTeamById', function(done){
    common.ftryRequest
      .post('/team/getTeamById')
      .send({id:''})
      .expect(200)
      .end(function(err, res){
        expect(res.body.code).to.be.equal(400);
        done();
      });
  });
  it('getTeamList', function(done){
    common.ftryRequest
        .post('/team/getTeamList')
        .send({start: 0, limit: 10})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end(function(err, res){
            expect(res.body.code).to.be.equal(0);
            done();
        });
  });

});
