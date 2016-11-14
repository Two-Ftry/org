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

    //用户密码不能为空
    if(!user.password){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '密码不能为空'
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

    // 手机号码格式验证
    if(user.phone && !Util.checkPhone(user.phone)){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '手机号码格式不正确'
        }));
        return deferred.promise;
    }

    //邮件格式验证
    if(user.email && !Util.checkEmail(user.email)){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '邮箱格式不正确'
        }));
        return deferred.promise;
    }


    // phone或者email不能重复
    var promiseArray = [];
    if(user.phone){
        promiseArray.push(this.getUserListByCondition({
            phone: user.phone
        }));
    }
    if(user.email){
        promiseArray.push(this.getUserListByCondition({
            email: user.email
        }));
    }

    Q.all(promiseArray).then(function (results) {
        var isExist = false;
        for(var i = 0, len = results.length; i < len; i++){
            var itemResultCount = results[i].data.count;
            if(itemResultCount > 0){
                isExist = true;
                break;
            }
        }
        if(isExist){
            deferred.reject(new Result({
                code: Code.__SERVER_ERROR__,
                msg: '手机号码/邮箱已经注册'
            }));
        }else{
            if(user.isOff == true || user.isOff == 'true'){
                user.isOff = true;
            }else{
                user.isOff = false;
            }
            if(user.isLeave == true || user.isLeave == 'true'){
                user.isLeave = true;
            }else{
                user.isLeave = false;
            }
            if(user.isDelete == true || user.isDelete == 'true'){
                user.isDelete = true;
            }else{
                user.isDelete = false;
            }
            user.password = Util.md5(user.password);
            var newUser = userDao.save(user);
            deferred.resolve(new Result({
                code: Code.__SUCCESS__,
                data: newUser
            }));
        }

    }, function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
};

/**
 * 根据id删除用户(不提供这个操作)
 * @param id
 */
UserService.prototype.deleteById = function (id) {
    var deferred = Q.defer();

    if(!id){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'id 不能为空'
        }));
        return deferred.promise;
    }

    //删除与组织的关联关系(不删除)
    //删除与角色的关联关系（不删除）
    //删除与工作圈的关联关系（如果是创建者，怎么办？）-resolve: 标记删除
    this.updateById({
        id: id,
        isDelete: true
    }).then(function (data) {
        deferred.resolve(new Result({
            code: data.code,
            msg: '删除成功'
        }));
    }, function (err) {
        deferred.reject(new Result({
                code: err.code,
                error: err.error,
                msg: '删除数据失败'
            }));
    });

    return deferred.promise;
};

/**
 * 根据id更新用户信息
 * @param user
 */
UserService.prototype.updateById = function (user) {
    var deferred = Q.defer();

    if(!user || !user.id){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'user.id 不能为空'
        }));
        return deferred.promise;
    }

    //不允许制空手机号码，并验证手机号码格式
    if(user.phone == ''){
        delete user.phone;
    }
    if(user.phone && !Util.checkPhone(user.phone)){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '手机号码格式不正确'
        }));
        return deferred.promise;
    }
    //不允许制空邮箱，并验证邮箱格式
    if(user.email == ''){
        delete user.email;
    }
    if(user.email && !Util.checkEmail(user.email)){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '邮箱格式不正确'
        }));
        return deferred.promise;
    }

    userDao.updateById(user).then(function(data){
        deferred.resolve(new Result({
            code: Code.__SUCCESS__,
            data: data
        }))
    }, function (err) {
        deferred.reject(new Result({
            code: Code.__SERVER_ERROR__,
            error: err,
            msg: '更新数据失败'
        }));
    });

    return deferred.promise;
};

/**
 * 根据id获取用户信息
 * @param id
 */
UserService.prototype.getUserById = function (id) {
    var deferred = Q.defer();

    if(!id){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'id 不能为空'
        }));
        return deferred.promise;
    }

    userDao.getUserById(id).then(function (data) {
        deferred.resolve(new Result({
            code: Code.__SUCCESS__,
            data: data
        }));
    }, function (err) {
        deferred.resolve(new Result({
            code: Code.__SERVER_ERROR__,
            error: err
        }));
    });

    return deferred.promise;
};

/**
 * 根据添加查询用户信息
 * @param condition
 */
UserService.prototype.getUserListByCondition = function (condition) {
    var deferred = Q.defer();

    if(!condition){
        condition = {};
    }

    //处理分页(强制分页)
    Util.pageCtrl(condition, true);

    userDao.getUserListByCondition(condition).then(function(data){
        deferred.resolve(new Result({
            code: Code.__SUCCESS__,
            data: data
        }));
    }, function (err) {
        deferred.reject(new Result({
            code: Code.__SERVER_ERROR__,
            error: err,
            msg: '获取用户信息失败'
        }));
    });

    return deferred.promise;
};

/**
 * 登录
 * @param condition
 * @returns {*|promise}
 */
UserService.prototype.login = function (condition) {
    var deferred = Q.defer();

    if(!condition || !condition.password || (!condition.phone && !condition.email)){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '用户名、密码不能为空'
        }));
        return deferred.promise;
    }
    if(condition.phone){
        condition.phone = condition.phone.trim();
    }
    if(condition.email){
        condition.email = condition.email.trim();
    }
    if(condition.phone && !Util.checkPhone(condition.phone)){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '手机号码格式不正确'
        }));
        return deferred.promise;
    }

    if(condition.email && !Util.checkEmail(condition.email)){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '邮箱格式不正确'
        }));
        return deferred.promise;
    }

    var _condition = {};
    if(condition.phone){
        _condition.phone = condition.phone;
    }
    if(condition.email){
        _condition.email = condition.email;
    }

    this.getUserListByCondition(_condition).then(function (data) {
        if(data && data.data && data.data.count == 1){
            deferred.resolve(new Result({
                code: Code.__SUCCESS__,
                data: data.data.data[0]
            }));
        }else if(data && data.data && data.data.count > 1){
            deferred.reject(new Result({
                code: Code.__NOT_FOUNT__,
                data: data.data,
                msg: '存在重复用户'
            }));
        }else{
            deferred.reject(new Result({
                code: Code.__NOT_FOUNT__,
                data: data.data,
                msg: '用户不存在'
            }));
        }
    }, function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
};

module.exports = UserService;