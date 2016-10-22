/**
 * Created by Administrator on 2016/10/7 0007.
 */

var Q = require('q');
//var async = require('async');

var OrgDao = require('../dao/OrgDao');
var Code = require('../../../common/domain/Code');
var Result = require('../../../common/domain/Result');
var ConstUtil = require('../../../common/ConstUtil');
var TeamService = require('../../team/service/TeamService');
var Util = require('../../../common/Util');

var OrgService = function () {};

var orgDao = new OrgDao();
/**
 * 新建Org
 * @param org
 */
OrgService.prototype.save = function(org){
    var deferred = Q.defer();
    if(!org){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__SERVER_ERROR__,
            msg: '对象不能为null'
        }));
        return deferred.promsise;
    }

    if(!org.tid){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'tid 不能为空'
        }));
        return deferred.promise;
    }

    var teamService = new TeamService();
    var promiseArray = [teamService.getTeamById(org.tid)];
    if(org.parentOrgId){
        //parentOrgId是否存在
        promiseArray.push(this.getOrgById(org.parentOrgId));
    }

    Q.all(promiseArray).then(function(values){
        //默认不是顶级机构
        if(org.isTop == null || org.isTop == undefined){
            org.isTop = false;
        }

        if(!org.createTime){
            org.createTime = new Date().getTime();
            org.updateTime = org.createTime;
        }

        var newOrg = orgDao.save(org);

        if(newOrg){
            deferred.resolve(new Result({
                code: Code.__SUCCESS__,
                data: newOrg
            }));
        }else{
            deferred.reject(new Result({
                code: Code.__SERVER_ERROR__,
                msg: '创建Org失败'
            }));
        }
    },function (err) {
        console.log('getTeamById err:', err);
        deferred.reject(err);
    });


    return deferred.promise;
};

/**
 * 根据Id更新Org信息
 * @param org
 */
OrgService.prototype.updateOrgById = function(org){
    var deferred = Q.defer();

    if(!org || !org.id){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'org id 不能为空'
        }));
        return deferred.promise;
    }

    if(org.parentOrgId && org.id == org.parentOrgId){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'orgId 不能和 parentOrgId相等'
        }));
        return deferred.promise;
    }

    //不允许修改isTop、tid这两个属性
    if(org.isTop){
        delete org.isTop;
    }
    if(org.tid){
        delete org.tid;
    }

    //更新时间
    org.updateTime = new Date().getTime();

    //允许修改parentOrgId，但是只有在org.id不是顶级组织，并且parentOrgId存在与当前圈的情况下才允许修改。
    if(org.parentOrgId){

        var promiseArray = [];
        promiseArray.push(this.getOrgById(org.id));
        //TODO 此处getOrgsByCondition需要加上 tid: 'xx'的查询条件，要完成了用户登录功能后再完成
        promiseArray.push(this.getOrgsByCondition({_id: org.parentOrgId}, false));
        Q.all(promiseArray).then(function (values) {
            var orgResult = values[0];
            var parentOrgResult = values[1];
            if(orgResult && orgResult.data && parentOrgResult
                && parentOrgResult.data &&
                parentOrgResult.data.length == 1){//數據存在
                //保存org信息
                orgDao.updateOrgById(org).then(function (data) {
                    deferred.resolve(new Result({
                        code: Code.__SUCCESS__,
                        data: data
                    }));
                }, function (err) {
                    deferred.reject(new Result({
                        code: Code.__NOT_FOUND__,
                        error: err,
                        msg: err.msg || '保存org信息失败'
                    }));
                });
            }else{
                deferred.reject(new Result({
                    code: Code.__SERVER_ERROR__,
                    msg: 'id不存在或者parentOrgId不存在'
                }));
            }

        }, function (err) {
            deferred.reject(err);
        });
    }else{

        //保存org信息
        orgDao.updateOrgById(org).then(function (data) {
            deferred.resolve(new Result({
                code: Code.__SUCCESS__,
                data: data
            }));
        }, function (err) {
            deferred.reject(new Result({
                code: Code.__NOT_FOUND__,
                error: err,
                msg: err.msg || '保存org信息失败'
            }));
        });
    }

    return deferred.promise;
};

/**
 * 根据Id删除Org
 * @param id
 */
OrgService.prototype.deleteById = function (id) {
    var deferred = Q.defer();

    if(!id){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__SERVER_ERROR__,
            msg: 'Id 不能为空'
        }));
        return deferred.promise;
    }

    var promiseArray = [];

    //组织里面有成员如何处理？（如果删除组织后，成员没有挂靠在任何组织下，则移动到根组织）
    //TODO userServer.moveUserToRootByOrgId(id)

    //同时删除有下级组织
    promiseArray.push(this.deleteByCondition({parentOrgId: id}));

    //要在userServer.moveUserToRootByOrgId、this.deleteByCondition()两个方法执行完成后才能进行
    Q.all(promiseArray).then(function () {
        orgDao.deleteById(id).then(function(data){
                deferred.resolve(new Result({
                    code: Code.__SUCCESS__,
                    msg: '',
                    data: data
                }));
            }, function (err) {
                deferred.reject(new Result({
                    code: Code.__SERVER_ERROR__,
                    msg: '删除组织机构失败',
                    error: err
                }));
        });
    }, function (err) {
        deferred.reject(err);
    });



    return deferred.promise;
};

/**
 * 根据条件删除组织机构（要用到递归，小心）
 * @param condition
 */
OrgService.prototype.deleteByCondition = function (condition) {
    var deferred = Q.defer();

    if(!condition){
        Util.setTimeoutReject(deferred, {
            error: '条件不能为空'
        });
    }
    var me = this;
    //组织里面有成员如何处理？（如果删除组织后，成员没有挂靠在任何组织下，则移动到根组织）
    //TODO userServer.moveUserToRootByOrgId(id)

    //删除下级组织(先获取下级组织的id，再去判断是否有下级组织，再删除)
    console.log('condition', condition);
    this.getOrgsByCondition(condition, false).then(function (data) {
        if(data.data && data.data.length > 0){
            var promiseArray = [];
            for(var i = 0, len = data.data.length; i < len; i++){
                var item = data.data[i];
                var itemId = (item.id || item._id).toString();
                if(itemId){
                    promiseArray.push(me.deleteByCondition({parentOrgId: itemId}));
                }
            }
            if(promiseArray.length > 0){
                Q.all(promiseArray).then(function () {
                    orgDao.deleteByCondition(condition).then(function (data) {
                        Util.resolveWithResult(deferred, Code.__SUCCESS__, data, '');
                    }, function (err) {
                        Util.rejectWithResult(deferred, Code.__SERVER_ERROR__, err, '删除组织机构失败');
                    });
                }, function (c) {
                    //下级组织删除失败，不再删除，返回上一层
                    deferred.reject(err);
                });
            }else{
                //没有下级组织，直接删除
                orgDao.deleteByCondition(condition).then(function (data) {
                    Util.resolveWithResult(deferred, Code.__SUCCESS__, data, '');
                }, function (err) {
                    Util.rejectWithResult(deferred, Code.__SERVER_ERROR__, err, '删除组织机构失败');
                });
            }

        }else{
            orgDao.deleteByCondition(condition).then(function (data) {
                Util.resolveWithResult(deferred, Code.__SUCCESS__, data, '');
            }, function (err) {
                Util.rejectWithResult(deferred, Code.__SERVER_ERROR__, err, '删除组织机构失败');
            });
        }
    }, function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
};

/**
 * 根据Id获取Org信息
 * @param id
 */
OrgService.prototype.getOrgById = function(id){
    var deferred = Q.defer();

    if(!id){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__SERVER_ERROR__,
            msg: 'Id 不能为空'
        }));
        return deferred.promise;
    }

    orgDao.getOrgById(id).then(function (data) {
       deferred.resolve(new Result({
           code: Code.__SUCCESS__,
           data: data
       }));
    }, function (err) {
        deferred.reject(new Result({
            code: Code.__SERVER_ERROR__,
            error: err,
            msg: '获取组织信息失败'
        }));
    });

    return deferred.promise;
};

/**
 * 根据父org的id查询所有下属org信息
 * @param id
 * @param isPaging 是否分页
 */
OrgService.prototype.getSubOrgsByParentOrgId = function (id, isPaging) {
    var deferred = Q.defer();

    if(!id){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__SERVER_ERROR__,
            msg: 'Id 不能为空'
        }));
        return deferred.promise;
    }

    var query = {
        parentOrgId: id
    };

    //默认分页
    if(!isPaging || isPaging === 'true' || isPaging === true){
        isPaging = true;
    }else{
        isPaging = false;
    }

    this.getOrgsByCondition(query, isPaging).then(function (data) {
        deferred.resolve(data);
    }, function (err) {
        deferred.reject(err);
    });


    return deferred.promise;
};

/**
 * 根据tid（工作圈id）获取第一级组织机构的信息(每个tid只有一个top org)
 * @param tid
 */
OrgService.prototype.getTopOrgByTid = function (tid) {
    var deferred = Q.defer();

    if(!tid){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: 'tid不能为空'
        }));
        return deferred.promise;
    }

    orgDao.getTopOrgByTid(tid).then(function(data){
        deferred.resolve(new Result({
            code: Code.__SUCCESS__,
            data: data
        }));
    }, function (err) {
       deferred.reject(new Result({
           code: Code.__SERVER_ERROR__,
           error: err,
           msg: '获取org信息失败'
       }));
    });

    return deferred.promise;
};

/**
 *
 * @param query
 * @param isPaging 是否进行分页，默认进行分页
 * @returns {*|promise}
 */
OrgService.prototype.getOrgsByCondition = function (query, isPaging) {
    var deferred = Q.defer();

    if(!query){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '条件不能为空'
        }));
        return deferred.promise;
    }

    //处理分页
    Util.pageCtrl(query, isPaging);

    orgDao.getOrgsByCondition(query).then(function(data){
        deferred.resolve(new Result({
            code: Code.__SUCCESS__,
            data: data
        }));
    }, function (err) {
        deferred.reject(new Result({
            code: Code.__SERVER_ERROR__,
            error: err,
            msg: '获取org信息失败'
        }));
    });

    return deferred.promise;
};


/**
 * 根据tid一次性查出组织机构的所有信息(不应该允许这样的操作，测试用)
 * @param tid
 */
OrgService.prototype.getOrgsByTid = function (query, isPaging) {
    var deferred = Q.defer();

    if(!query || !query.tid){
        Util.setTimeoutReject(deferred, new Result({
            code: Code.__NOT_FOUND__,
            msg: '条件不能为空'
        }));
        return deferred.promise;
    }

    //调用通用方法
    this.getOrgsByCondition(query, isPaging).then(function (data) {
        deferred.resolve(data);
    }, function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
};

module.exports = OrgService;