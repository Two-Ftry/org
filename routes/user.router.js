/**
 * @desc
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/23.
 */
var express = require('express');
var router = express.Router();

var UserService = require('../business/user/service/UserService');
var UserEntity = require('../business/user/domain/UserEntity');
var Util = require('../common/Util');
var ConstUtil = require('../common/ConstUtil');
var Result = require('../common/domain/Result');
var Code = require('../common/domain/Code');

var userService = new UserService();

/**
 * 新建User
 */
router.post('/save', function (req, res) {
    var entity = Util.getEntityInstance(req.body, new UserEntity());
    userService.save(entity).then(function (data) {
        res.send(data);
    }, function (err) {
        console.log('user router', err);
        res.send(err);
    });

});

/**
 * 登录
 */
router.post('/login', function (req, res) {
    var entity = Util.getEntityInstance(req.body, new UserEntity());

    userService.login(entity).then(function (data) {
       //存入session
        if(data && data.data){
            delete data.data.password;
            //csrf随机值
            req.session[ConstUtil.__CSRF__] = Util.getUuid();
        }
       req.session[ConstUtil.__USER_INFO__] = data && data.data ? data.data : {};
       res.send(new Result({
           code: Code.__SUCCESS__,
           msg: 'login success'
       }));
    }, function (err) {
        res.send(err);
    });
});

/**
 * 编辑User
 */
router.post('/updateById', function (req, res) {
    var entity = Util.getEntityInstance(req.body, new UserEntity(), true);
    userService.updateById(entity).then(function (data) {
        res.send(data);
    }, function (err) {
        console.log('user router', err);
        res.send(err);
    });

});

/**
 * 获取用户列表
 */
router.post('/getUserListByCondition', function (req, res) {
    var userInfo = req.session[ConstUtil.__USER_INFO__];
    userService.getUserListByCondition().then(function (data) {
        res.send(data);
    }, function (err) {
        console.log('user router', err);
        res.send(err);
    });

});

/**
 * 根据ID获取用户信息
 */
router.post('/getUserById', function (req, res) {
    var id = req.body.id;
    userService.getUserById(id).then(function (data) {
        res.send(data);
    }, function(err){
        res.send(err);
    });
});

/**
 * 根据ID删除用户
 */
router.post('/deleteById', function (req, res) {
    var id = req.body.id;
    userService.deleteById(id).then(function (data) {
        res.send(data);
    }, function(err){
        res.send(err);
    });
});

module.exports = router;
