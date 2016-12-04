/**
 * @desc
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/23.
 */
var express = require('express');
var router = express.Router();

var PredefinedRoleService = require('../business/role/service/PredefinedRoleService');
var PredefinedRoleEntity = require('../business/role/domain/PredefinedRoleEntity');
var Util = require('../common/Util');

var predefinedRoleService = new PredefinedRoleService();

/**
 * 新建PredefinedRole
 */
router.post('/save', function (req, res) {
    var entity = Util.getEntityInstance(req.body, new PredefinedRoleEntity());
    predefinedRoleService.save(entity).then(function (data) {
        res.send(data);
    }, function (err) {
        res.send(err);
    });

});

/**
 * 根据ID删除
 */
router.post('/deleteById', function (req, res) {
    var id = req.body.id;
    predefinedRoleService.deleteById(id).then(function (data) {
        res.send(data);
    }, function (err) {
        res.send(err);
    });

});

/**
 * 根据ID获取系统定义的角色
 */
router.post('/getPredefinedRoleById', function (req, res) {
    var id = req.body.id;
    predefinedRoleService.getPredefinedRoleById(id).then(function (data) {
        res.send(data);
    }, function (err) {
        res.send(err);
    });
});

/**
 * 根据ID获取系统定义的角色
 */
router.post('/getPredefinedRoleListByCondition', function (req, res) {
    var condition = {};
    var isPaging = req.body.isPaging;
    condition.start = req.body.start;
    condition.limit = req.body.limit;
    if(req.body.code){
        condition.code = req.body.code;
    }
    if(req.body.name){
        condition.name = req.body.name;
    }
    predefinedRoleService.getPredefinedRoleListByCondition(condition, isPaging).then(function (data) {
        res.send(data);
    }, function (err) {
        res.send(err);
    });
});

/**
 * 根据code获取信息
 */
router.post('/getPredefinedRoleByCode', function (req, res) {
    predefinedRoleService.getPredefinedRoleByCode(req.body.code).then(function (data) {
        res.send(data);
    }, function (err) {
        res.send(err);
    });
});

/**
 * 根据ID更新predefinedrole
 */
router.post('/updateById', function (req, res) {
    var role = Util.getEntityInstance(req.body, new PredefinedRoleEntity(), true);
   predefinedRoleService.updateById(role).then(function (data) {
       res.send(data);
   }, function (err) {
       res.send(err);
   });
});

module.exports = router;
