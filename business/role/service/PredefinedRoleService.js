
/**
 * @desc 角色的service层
 * Created by Administrator on 2016/10/23 0023.
 */
var Q = require('q');
var ConstUtil = require('../../../common/ConstUtil');
var Util = require('../../../common/Util');
var Code = require('../../../common/domain/Code');
var Result = require('../../../common/domain/Result');
var PredefinedRoleDao = require('../dao/PredefinedRoleDao');
var predefinedRoleDao = new PredefinedRoleDao();

var PredefinedRoleService = function () {};


/**
 * @desc 新建角色
 * @param role
 */
PredefinedRoleService.prototype.save = function (role) {
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

    //this.getPredefinedRoleByCode(code)判断code是否相同，相同则不允许添加

    this.getPredefinedRoleByCode(role.code).then(function(data){
        var predefinedRoleList = data.data;
        if(!predefinedRoleList || predefinedRoleList.length <= 0){
            //是否是系统提供的角色定义
            if(!role.isSys){
                role.isSys = true;
            }
            role.createTime = new Date().getTime();
            role.updateTime = role.createTime;

            var newRole = predefinedRoleDao.save(role);

            deferred.resolve(new Result({
                code: Code.__SUCCESS__,
                data: newRole
            }));
        }else{
            deferred.reject(new Result({
                code: Code.__SERVER_ERROR__,
                msg: '包含该code的角色已存在'
            }));
        }

    }, function(err){
        deferred.reject(err);
    });



    return deferred.promise;
};

/**
 * 根据ID删除角色
 * @param id
 */
PredefinedRoleService.prototype.deleteById = function (id) {
    var deferred = Q.defer();

    if(!id){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'id 不能为空'
        }));
        return deferred.promise;
    }

    predefinedRoleDao.deleteById(id).then(function(data){
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
PredefinedRoleService.prototype.updateById = function (role) {
    var deferred = Q.defer();

    if(!role || !role.id){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'role 或者 role.id 不能为空'
        }));
        return deferred.promise;
    }

    predefinedRoleDao.updateById(role).then(function(data){
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
PredefinedRoleService.prototype.getPredefinedRoleById = function (id) {
    var deferred = Q.defer();

    if(!id){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'id 不能为空'
        }));
        return deferred.promise;
    }

    predefinedRoleDao.getPredefinedRoleById(id).then(function (data) {
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
 * @desc 根据条件获取角色列表
 * @param condition
 */
PredefinedRoleService.prototype.getPredefinedRoleListByCondition = function (condition, isPaging) {
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

    predefinedRoleDao.getPredefinedRoleListByCondition(condition).then(function(data){
        deferred.resolve(new Result({
            code: Code.__SUCCESS__,
            data: data
        }));
    }, function (err) {
        deferred.reject(new Result({
            code: Code.__SERVER_ERROR__,
            error: err,
            msg: '获取PredefinedRole信息失败'
        }));
    });


    return deferred.promise;
};

/**
 * 根据code获取PredefinedRole的信息
 * @param code
 */
PredefinedRoleService.prototype.getPredefinedRoleByCode = function(code){
    var deferred = Q.defer();

    if(!code){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'code不能为空'
        }))
        return deferred.promise;
    }

    this.getPredefinedRoleListByCondition({
        code: code
    }).then(function(data){
        //code是唯一的
        deferred.resolve(data);
        //var predefinedRoleList = data.data;
        //if(predefinedRoleList && predefinedRoleList.length == 1){
        //    deferred.resolve(new Result({
        //        code: Code.__SUCCESS__,
        //        data: predefinedRoleList[0]
        //    }));
        //}else if(predefinedRoleList && predefinedRoleList.length > 1){
        //    deferred.reject(new Result({
        //        code: Code.__SERVER_ERROR,
        //        data: predefinedRoleList,
        //        msg: 'code值出现重复数据'
        //    }));
        //}else{
        //    deferred.reject(new Result({
        //        code: Code.__SERVER_ERROR__,
        //        msg: '获取不到数据'
        //    }));
        //}
    }, function(err){
        deferred.reject(err);
    });

    return deferred.promise;
};


module.exports = PredefinedRoleService;
