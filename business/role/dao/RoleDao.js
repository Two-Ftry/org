/**
 * @desc 角色的DAO层
 * Created by Administrator on 2016/10/23 0023.
 */
var Q = require('q');
var DaoUtil = require('../../../common/DaoUtil');
var Util = require('../../../common/Util');
var RoleEntity = require('../domain/RoleEntity');
var _tableName = 'f_crm_role';
var RoleModel = null;

var RoleDao = function () {};

/**
 * @desc 新建角色
 * @param role
 */
RoleDao.prototype.save = function (role) {
    if(!role){
        return 'role cannot be null';
    }
    if(!RoleModel){
        var schema = (new RoleEntity()).getSchema();
        RoleModel = DaoUtil.getModel(schema, _tableName);
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
    //TODO
};

/**
 * @desc 根据ID更新角色信息
 * @param role
 */
RoleDao.prototype.updateById = function (role) {
    //TODO
};

/**
 * @desc 根据id获取Role信息
 * @param id
 */
RoleDao.prototype.getRoleById = function (id) {
  //TODO
};

/**
 * @desc 根据条件获取角色列表
 * @param condition
 */
RoleDao.prototype.getRoleListByCondition = function (condition) {
    //TODO
};


module.exports = RoleDao;
