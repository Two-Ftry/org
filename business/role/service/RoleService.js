
/**
 * @desc 角色的service层
 * Created by Administrator on 2016/10/23 0023.
 */
var Q = require('q');
var ConstUtil = require('../../../common/ConstUtil');
var Util = require('../../../common/Util');
var Code = require('../../../common/domain/Code');
var Result = require('../../../common/domain/Result');
var RoleDao = require('../dao/RoleDao');
var roleDao = new RoleDao();

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

    //tid判断 TODO
    if(!role.tid){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'tid不能为空'
        }));
        return deferred.promise;
    }

    //是否是系统提供的角色定义
    // TODO 根据Code判断是系统定义的还是自定义的，并且同一个工作圈不能存在code相同的两个角色
    if(!role.isSys){
        role.isSys = false;
    }

    role.createTime = new Date().getTime();
    role.updateTime = role.createTime;

    var newRole = roleDao.save(role);

    deferred.resolve(new Result({
        code: Code.__SUCCESS__,
        data: newRole
    }));

    return deferred.promise;
};

/**
 * 根据ID删除角色
 * @param id
 */
RoleService.prototype.deleteById = function (id) {
    //TODO
};

/**
 * @desc 根据ID更新角色信息
 * @param role
 */
RoleService.prototype.updateById = function (role) {
    //TODO
};

/**
 * @desc 根据id获取Role信息
 * @param id
 */
RoleService.prototype.getRoleById = function (id) {
    //TODO
};

/**
 * @desc 根据条件获取角色列表
 * @param condition
 */
RoleService.prototype.getRoleListByCondition = function (condition) {
    //TODO
};


module.exports = RoleService;
