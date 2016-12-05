/**
 * 用户的DAO层
 * Created by Administrator on 2016/12/5.
 */
var Q = require('q');

var DaoUtil = require('../../../common/DaoUtil');
var UserEntity = require('../domain/UserEntity');

var _tableName = 'f_crm__user';
var schema = new UserEntity().getSchema();
var UserModel = DaoUtil.getModel(schema, _tableName);

var UserDao = function () {};

/**
 * 保存用户
 * @param user
 */
UserDao.prototype.save = function (user) {
    if(!user){
        return 'user cannot be null';
    }
    var entity = new UserModel(user);
    entity.save();
    return entity;
};

/**
 * 根据id删除用户
 * @param id
 */
UserDao.prototype.deleteById = function (id) {
    //TODO
};

/**
 * 根据id更新用户信息
 * @param user
 */
UserDao.prototype.updateById = function (user) {
    //TODO
};

/**
 * 根据id获取用户信息
 * @param id
 */
UserDao.prototype.getUserById = function (id) {
    //TODO
};

/**
 * 根据添加查询用户信息
 * @param condition
 */
UserDao.prototype.getUsersByCondition = function (condition) {
    //TODO
};

module.exports = UserDao;
