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

var OrgService = function () {};

var orgDao = new OrgDao();
/**
 * 新建Org
 * @param org
 */
OrgService.prototype.save = function(org){
    var deferred = Q.defer();
    if(!org){
        deferred.reject(new Result({
            code: Code.__SERVER_ERROR__,
            msg: '对象不能为null'
        }));
        return deferred.promsise;
    }

    if(!org.tid){
        deferred.reject(new Result({
            code: Code.__NOT_FOUND__,
            msg: 'tid 不能为空'
        }));
        return deferred.promise;
    }

    var teamService = new TeamService();
    Q.all([teamService.getTeamById(org.tid)]).done(function(values){
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
    }).fail(function (err) {
        console.log('getTeamById err:', err);
        deferred.reject(new Result({
            code: Code.__SERVER_ERROR__,
            error: err,
            msg: ''
        }));
    });

    //teamService.getTeamById(org.tid).then(function (data) {
    //    //TODO
    //
    //}, function (err) {
    //    return new Result({
    //        code: Code.__NOT_FOUND__,
    //        error: err,
    //        xmsg: '找不到对应的工作圈'
    //    });
    //});



    //if(org.parentOrgId){
    //    //TODO parentOrgId是否存在
    //}

    return deferred.promsise;
};

/**
 * 根据Id更新Org信息
 * @param org
 */
OrgService.prototype.updateOrgById = function(org){
    //TODO
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
    //TODO
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