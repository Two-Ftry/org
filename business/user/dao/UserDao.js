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
    var deferred = Q.defer();

    if(!id){
        Util.setTimeoutReject(deferred, {
            error: 'Id 不能为空'
        });
        return deferred.promise;
    }

    UserModel.findByIdAndRemove(id, deferred.makeNodeResolver());

    return deferred.promise;
};

/**
 * 根据id更新用户信息
 * @param user
 */
UserDao.prototype.updateById = function (user) {
    var deferred = Q.defer();

    if(!user || !user.id){
        Util.setTimeoutReject(deferred, {
            error: 'user or user.id cannot be null'
        });
        return deferred.promise;
    }

    user = DaoUtil.replaceIdWithUnderlineId(user);

    UserModel.findByIdAndUpdate(user._id, user, deferred.makeNodeResolver());

    return deferred.promise;
};

/**
 * 根据id获取用户信息
 * @param id
 */
UserDao.prototype.getUserById = function (id) {
    var deferred = Q.defer();

    if(!id){
        Util.setTimeoutReject(deferred, {
            error: 'id 不能为空'
        });
        return deferred.promise;
    }

    UserModel.findById(id, deferred.makeNodeResolver());

    return deferred.promise;
};

/**
 * 根据添加查询用户信息
 * @param condition
 */
UserDao.prototype.getUserListByCondition = function (condition) {
    var deferred = Q.defer();
    var _condition = {};
    Object.assign(_condition, condition || {});

    if(condition.keyword){
        delete _condition.keyword;
        var keywordStr = '/' + condition.keyword + '/i';
        _condition = {
            "$or":[
                {userName: eval(keywordStr)},
                {phone: eval(keywordStr)},
                {email: eval(keywordStr)}
            ]
        };
    }

    delete _condition.start;
    delete _condition.limit;

    UserModel.find(_condition, null, {skip: condition.start, limit: condition.limit}, function(err, dataList){
        if(err){
            console.log('dao getUserList', err);
            deferred.reject(err);
        }else{
            UserModel.count(_condition, function(err, count){
                if(err){
                    console.log('dao getUserList count', err);
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

module.exports = UserDao;
