/**
 * @desc
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/23.
 */
var express = require('express');
var router = express.Router();

var RoleService = require('../business/role/service/RoleService');
var RoleEntity = require('../business/role/domain/RoleEntity');
var Util = require('../common/Util');
var Query = require('../common/domain/Query');

var roleService = new RoleService();

/**
 * 新建Role
 */
router.post('/save', function (req, res) {
    var entity = Util.getEntityInstance(req.body, new RoleEntity());
    roleService.save(entity).then(function (data) {
        res.send(data);
    }, function (err) {
        console.log('org router', err);
        res.send(err);
    });

});

/**
 * 根据ID获取角色信息
 */
router.post('/getRoleById', function (req, res) {
    var id = req.body.id;
    roleService.getRoleById(id).then(function (data) {
        res.send(data);
    }, function(err){
        res.send(err);
    });
});

/**
 * 根据ID获取角色信息
 */
router.post('/getRoleListByCondition', function (req, res) {
    var condition = Util.getEntityInstance(req.body, new Query());
    var isPaging = req.body.isPaging;
    if(req.body.code){
        condition.code = req.body.code;
    }
    if(req.body.tid){
        condition.tid = req.body.tid;
    }
    roleService.getRoleListByCondition(condition, isPaging).then(function (data) {
        res.send(data);
    }, function(err){
        res.send(err);
    });
});

/**
 * 根据ID删除
 */
router.post('/deleteById', function (req, res) {
    var id = req.body.id;
    roleService.deleteById(id).then(function (data) {
        res.send(data);
    }, function (err) {
        res.send(err);
    });

});

/**
 * 根据ID更新predefinedrole
 */
router.post('/updateById', function (req, res) {
    var role = Util.getEntityInstance(req.body, new RoleEntity(), true);
    roleService.updateById(role).then(function (data) {
        res.send(data);
    }, function (err) {
        res.send(err);
    });
});
module.exports = router;
