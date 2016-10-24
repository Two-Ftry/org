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


module.exports = router;
