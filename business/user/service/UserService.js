/**
 * 用户的service层
 * Created by Administrator on 2016/12/5.
 */
var Q = require('q');

var ConstUtil = require('../../../common/ConstUtil');
var Util = require('../../../common/Util');
var Code = require('../../../common/domain/Code');
var Result = require('../../../common/domain/Result');
var UserDao = require('../dao/UserDao');
var userDao = new UserDao();

var UserService = function () {};

/**
 * 保存用户
 * @param user
 */
UserService.prototype.save = function (user) {
    var deferred = Q.defer();
    if(!user){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '用户实体不能为空'
        }));
        return deferred.promise;
    }

    //手机、邮箱不能同时为空
    if(!user.phone && !user.email){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '手机号码不能为空'
        }));
        return deferred.promise;
    }

    var newUser = userDao.save(user);

    deferred.resolve(new Result({
        code: Code.__SUCCESS__,
        data: newUser
    }));

    return deferred.promise;
};

/**
 * 根据id删除用户
 * @param id
 */
UserService.prototype.deleteById = function (id) {
    //TODO
};

/**
 * 根据id更新用户信息
 * @param user
 */
UserService.prototype.updateById = function (user) {
    //TODO
};

/**
 * 根据id获取用户信息
 * @param id
 */
UserService.prototype.getUserById = function (id) {
    //TODO
};

/**
 * 根据添加查询用户信息
 * @param condition
 */
UserService.prototype.getUsersByCondition = function (condition) {
    //TODO
};

module.exports = UserService;