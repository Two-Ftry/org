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


module.exports = router;
