
/**
 * @desc 角色的service层
 * Created by Administrator on 2016/10/23 0023.
 */
var Q = require('q');
var async = require('async');
var ConstUtil = require('../../../common/ConstUtil');
var Util = require('../../../common/Util');
var Code = require('../../../common/domain/Code');
var Result = require('../../../common/domain/Result');
var RoleDao = require('../dao/RoleDao');
var roleDao = new RoleDao();

var PredefinedRoleService = require('./PredefinedRoleService');
var predefinedRoleService = new PredefinedRoleService();

var RoleService = function () {};


/**
 * @desc 新建角色
 * @param role
 */
RoleService.prototype.save = function (role) {
    var deferred = Q.defer();
    if(!role){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '角色实体不能为空'
        }));
        return deferred.promise;
    }

    //role.code 角色编码不能为空
    if(!role.code){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '角色编码不能为空'
        }));
        return deferred.promise;
    }

    //role.name 角色名称不能为空
    if(!role.name){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '角色名称不能为空'
        }));
        return deferred.promise;
    }

    //tid判断 TODO tid 应该从当前登录用户的session中获取
    if(!role.tid){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'tid不能为空'
        }));
        return deferred.promise;
    }

    //是否是系统提供的角色定义
    var me = this;
    //根据Code判断是系统定义的还是自定义的，并且同一个工作圈不能存在code相同的两个角色
    async.parallel([
        function (callback) {
            predefinedRoleService.getPredefinedRoleByCode(role.code).then(function (data) {
               callback(null, data);
            }, function (err) {
                callback(err, null);
            });
        },
        function(callback){
            //根据code获取角色
            me.getRoleListByCondition({
                code: role.code,
                tid: role.tid
            }, false).then(function (data) {
                callback(null, data);
            }, function (err) {
                callback(err, null);
            });
        }
    ], function (err, results) {
        if(err){
            deferred.reject({
                error: err,
                data: results
            });
        }else{
            //判断是否为系统定义的角色
            var predefinedRole = results[0].data;
            if(predefinedRole && predefinedRole.length > 0){
                role.isSys = true;
            }else{
                role.isSys = false;
            }

            var oldRoleList = results[1].data.data;
            if(!oldRoleList || oldRoleList.length <= 0){//该角色在该工作圈还不存在
                role.createTime = new Date().getTime();
                role.updateTime = role.createTime;

                var newRole = roleDao.save(role);

                deferred.resolve(new Result({
                    code: Code.__SUCCESS__,
                    data: newRole
                }));
            }else{
                deferred.reject(new Result({
                    code: Code.__SERVER_ERROR__,
                    msg: '该角色已经存在'
                }));
            }
        }
    });



    return deferred.promise;
};

/**
 * 根据ID删除角色
 * @param id
 */
RoleService.prototype.deleteById = function (id) {
    var deferred = Q.defer();

    if(!id){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'id 不能为空'
        }));
        return deferred.promise;
    }

    roleDao.deleteById(id).then(function(data){
        deferred.resolve(new Result({
            code: Code.__SUCCESS__,
            data: data
        }));
    }, function (err) {
        deferred.reject(new Result({
            code: Code.__SERVER_ERROR__,
            error: err
        }));
    });

    return deferred.promise;
};

/**
 * @desc 根据ID更新角色信息
 * @param role
 */
RoleService.prototype.updateById = function (role) {
    var deferred = Q.defer();

    if(!role || !role.id){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'role 或者 role.id 不能为空'
        }));
        return deferred.promise;
    }

    roleDao.updateById(role).then(function(data){
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
 * @desc 根据id获取Role信息
 * @param id
 */
RoleService.prototype.getRoleById = function (id) {
    var deferred = Q.defer();

    if(!id){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'id 不能为空'
        }));
        return deferred.promise;
    }

    roleDao.getRoleById(id).then(function (data) {
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
 * 根据code获取角色
 * @param id
 * @returns {*|promise}
 */
RoleService.prototype.getRoleByCode = function (code) {
    var deferred = Q.defer();

    if(!code){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'code 不能为空'
        }));
        return deferred.promise;
    }

    this.getRoleListByCondition({
        code: code
    }, false).then(function (data) {
        deferred.resolve(data);
    }, function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
};

/**
 * @desc 根据条件获取角色列表
 * @param condition
 */
RoleService.prototype.getRoleListByCondition = function (condition, isPaging) {
    var deferred = Q.defer();

    if(!condition){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '条件不能为空'
        }));
        return deferred.promise;
    }

    //处理分页
    Util.pageCtrl(condition, isPaging);

    roleDao.getRoleListByCondition(condition).then(function(data){
        deferred.resolve(new Result({
            code: Code.__SUCCESS__,
            data: data
        }));
    }, function (err) {
        deferred.reject(new Result({
            code: Code.__SERVER_ERROR__,
            error: err,
            msg: '获取role信息失败'
        }));
    });

    return deferred.promise;
};


module.exports = RoleService;
