/**
 * @desc 角色的DAO层
 * Created by Administrator on 2016/10/23 0023.
 */
var Q = require('q');
var DaoUtil = require('../../../common/DaoUtil');
var Util = require('../../../common/Util');
var PredefinedRoleEntity = require('../domain/PredefinedRoleEntity');
var _tableName = 'f_crm_predefined_role';
var PredefinedRoleModel = null;
PredefinedRoleModel = DaoUtil.getModel((new PredefinedRoleEntity()).getSchema(), _tableName);

var PredefinedRoleDao = function () {};



/**
 * @desc 新建角色
 * @param role
 */
PredefinedRoleDao.prototype.save = function (role) {
    if(!role){
        return 'role cannot be null';
    }
    if(!PredefinedRoleModel){
        var schema = (new PredefinedRoleEntity()).getSchema();
        PredefinedRoleModel = DaoUtil.getModel(schema, _tableName);
    }
    var entity = new PredefinedRoleModel(role);
    entity.save();
    return entity;
};

/**
 * 根据ID删除角色
 * @param id
 */
PredefinedRoleDao.prototype.deleteById = function (id) {
    var deferred = Q.defer();

    if(!id){
        Util.setTimeoutReject(deferred, {
            error: 'id 不能为空'
        });
        return deferred.promise;
    }

    if(!PredefinedRoleModel){
        var schema = (new PredefinedRoleEntity()).getSchema();
        PredefinedRoleModel = DaoUtil.getModel(schema, _tableName);
    }

    PredefinedRoleModel.findByIdAndRemove(id, function (err, data) {
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
PredefinedRoleDao.prototype.updateById = function (role) {
    var deferred = Q.defer();

    if(!role || !role.id){
        Util.setTimeoutReject(deferred, {
            error: 'role or role.id cannot be null'
        });
        return deferred.promise;
    }

    role = DaoUtil.replaceIdWithUnderlineId(role);

    PredefinedRoleModel.findByIdAndUpdate(role._id, role, deferred.makeNodeResolver());

    return deferred.promise;
};

/**
 * @desc 根据id获取PredefinedRole信息
 * @param id
 */
PredefinedRoleDao.prototype.getPredefinedRoleById = function (id) {
  var deferred = Q.defer();

  if(!id){
      Util.setTimeoutReject(deferred, {
          error: 'id 不能为空'
      });
      return deferred.promise;
  }

  PredefinedRoleModel.findById(id).then(function (data) {
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
PredefinedRoleDao.prototype.getPredefinedRoleListByCondition = function (condition) {
    var deferred = Q.defer();

    if(!condition){
        Util.setTimeoutReject(deferred, {
            error: '条件不能为空'
        });
        return deferred.promise;
    }

    if(condition.limit){//分页
        var _query = {};
        Object.assign(_query, condition);

        delete  _query.start;
        delete  _query.limit;
        PredefinedRoleModel.find(_query, null, {skip: condition.start, limit: condition.limit}, function (err, data) {
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(data);
            }
        });
    }else{//不分页
        PredefinedRoleModel.find(condition, function (err, data) {
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(data);
            }
        });
    }

    return deferred.promise;
};


module.exports = PredefinedRoleDao;
