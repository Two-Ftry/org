/**
 * @desc 角色的DAO层
 * Created by Administrator on 2016/10/23 0023.
 */
var Q = require('q');
var DaoUtil = require('../../../common/DaoUtil');
var Util = require('../../../common/Util');
var RoleEntity = require('../domain/RoleEntity');
var _tableName = 'f_crm_role';
var RoleModel = DaoUtil.getModel((new RoleEntity()).getSchema(), _tableName);

var RoleDao = function () {};

/**
 * @desc 新建角色
 * @param role
 */
RoleDao.prototype.save = function (role) {
    if(!role){
        return 'role cannot be null';
    }
    var entity = new RoleModel(role);
    entity.save();
    return entity;
};

/**
 * 根据ID删除角色
 * @param id
 */
RoleDao.prototype.deleteById = function (id) {
    var deferred = Q.defer();

    if(!id){
        Util.setTimeoutReject(deferred, {
            error: 'id 不能为空'
        });
        return deferred.promise;
    }

    RoleModel.findByIdAndRemove(id, function (err, data) {
        if(err){
            deferred.reject(err);
        } else{
            deferred.resolve(data);
        }
    });

    return deferred.promise;
};

/**
 * @desc 根据ID更新角色信息
 * @param role
 */
RoleDao.prototype.updateById = function (role) {
    var deferred = Q.defer();

    if(!role || !role.id){
        Util.setTimeoutReject(deferred, {
            error: 'role or role.id cannot be null'
        });
        return deferred.promise;
    }

    role = DaoUtil.replaceIdWithUnderlineId(role);

    RoleModel.findByIdAndUpdate(role._id, role, deferred.makeNodeResolver());

    return deferred.promise;
};

/**
 * @desc 根据id获取Role信息
 * @param id
 */
RoleDao.prototype.getRoleById = function (id) {
    var deferred = Q.defer();

    if(!id){
        Util.setTimeoutReject(deferred, {
            error: 'id 不能为空'
        });
        return deferred.promise;
    }

    RoleModel.findById(id, deferred.makeNodeResolver());

    return deferred.promise;
};

/**
 * @desc 根据条件获取角色列表
 * @param condition
 */
RoleDao.prototype.getRoleListByCondition = function (condition) {
    var deferred = Q.defer();
    var _condition = {};
    Object.assign(_condition, condition || {});

    if(condition.keyword){
        delete _condition.keyword;
        var keywordStr = '/' + condition.keyword + '/i';
        _condition = {
            "$or":[
                {name: eval(keywordStr)},
                {remark: eval(keywordStr)}
            ]
        };
    }

    delete _condition.start;
    delete _condition.limit;

    RoleModel.find(_condition, null, {skip: condition.start, limit: condition.limit}, function(err, dataList){
        if(err){
            console.log('dao getRoleList', err);
            deferred.reject(err);
        }else{
            RoleModel.count(_condition, function(err, count){
                if(err){
                    console.log('dao getRoleList count', err);
                    deferred.reject(err);
                }else{
                    deferred.resolve({
                        count: count,
                        data: dataList
                    });
                }
            });
        }
    });
    return deferred.promise;
};


module.exports = RoleDao;
