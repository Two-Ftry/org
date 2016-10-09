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
        console.log('getTeamById done:', values);
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

    //不允许修改isTop、tid这两个属性
    if(org.isTop){
        //TODO
    }
    if(org.tid){
        //TODO
    }

    //允许修改parentOrgId，但是只有在org.id不是顶级组织，并且parentOrgId存在与当前圈的情况下才允许修改。
    if(org.parentOrgId){
        //TODO
    }

    //更新时间
    org.updateTime = new Date().getTime();

    orgDao.updateOrgById(org).then(function (data) {
       deferred.resolve(new Result({
           code: Code.__SUCCESS__,
           data: data
       }));
    }, function (err) {
        deferred.reject(new Result({
            code: Code.__NOT_FOUND__,
            error: err,
            msg: err.msg || ''
        }));
    });

    return deferred.promise;
};

/**
 * 根据Id删除Org
 * @param id
 */
OrgService.prototype.deleteById = function (id) {
    //TODO
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
 */
OrgService.prototype.getSubOrgsByParentOrgId = function (id) {
    //TODO
};

/**
 * 根据tid（工作圈id）获取第一级组织机构的信息(每个tid只有一个top org)
 * @param tid
 */
OrgService.prototype.getTopOrgByTid = function (tid) {
    //TODO
};

/**
 * 根据tid一次性查出组织机构的所有信息
 * @param tid
 */
OrgService.prototype.getOrgsByTid = function (tid) {
    //TODO
};

module.exports = OrgService;