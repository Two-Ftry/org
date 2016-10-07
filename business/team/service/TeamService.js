/**
 * @desc 工作圈服务层
 * Created by Administrator on 2016/10/5 0005.
 */
var Q = require('q');
var Code = require('../../../common/domain/Code');
var Result = require('../../../common/domain/Result');
var ConstUtil = require('../../../common/ConstUtil');

var TeamService = function(){};
var TeamDao = require('../dao/TeamDao');

var teamDao = new TeamDao();

//保存工作圈
TeamService.prototype.save = function(team){
    if(!team.createTime){
        team.createTime = new Date().getTime();
        team.updateTime = team.createTime;
    }
    teamDao.save(team);
};

//根据ID删除工作圈
TeamService.prototype.deleteById = function (id) {
    var deferred = Q.defer();

    if(!id){
        setTimeout(function () {
            deferred.reject(new Result({
                code: Code.__NOT_FOUND__,
                msg: 'id cannot be empty'
            }));
        }, 200);
        return deferred.promise;
    }

    //调用dao层的删除操作
    teamDao.deleteById(id).then(function(data){
        console.log('dao 删除成功!!');
        deferred.resolve(new Result({
            code: Code.__SUCCESS__
        }));
    }, function(err){
        deferred.reject(new Result({
            code: Code.__SERVER_ERROR__,
            error: err,
            msg: ''
        }));
    });

    return deferred.promise;
};

//根据ID获取工作圈内容
TeamService.prototype.getTeamById = function(id){
    var deferred = Q.defer();

    if(!id){
        setTimeout(function () {
            deferred.reject(new Result({
                code: Code.__NOT_FOUND__,
                error: {},
                msg: 'id cannot be empty'
            }));
        }, 200);
        return deferred.promise;
    }

    teamDao.getTeamById(id).then(function (team) {
        //deferred.resolve(team);
        if(team){
            deferred.resolve(new Result({
                code: Code.__SUCCESS__,
                data: team
            }));
        }else{
            deferred.reject(new Result({
                code: Code.__SERVER_ERROR__,
                msg: '找不到对应的工作圈'
            }));
        }
    }, function (err) {
        deferred.reject(new Result({
         code: Code.__SERVER_ERROR__,
         error: err,
         msg: '找不到对应的工作圈'
        }));
    });

    return deferred.promise;
};

//根据ID更新工作圈信息
TeamService.prototype.updateTeamById = function (team) {
    var deferred = Q.defer();

    if(!team || !team.id){
        setTimeout(function () {
            deferred.reject(new Result({
                code: Code.__NOT_FOUND__,
                msg: 'service id cannot be empty'
            }));
        }, 200);
        return deferred.promise;
    }

    //更新updateTime
    team.updateTime = new Date().getTime();

    teamDao.updateTeamById(team).then(function (data) {
        deferred.resolve(data);
    }, function (err) {
        deferred.resolve(err);
    });

    return deferred.promise;
};

//根据ID更新工作圈信息
TeamService.prototype.getTeamList = function (query) {
    var deferred = Q.defer();

    if(!query){
        query = {};
        query.start = ConstUtil.__PAGE_START__;
        query.limit = ConstUtil.__page_LIMIT__;
    }

    teamDao.getTeamList(query).then(function (dataList) {
        deferred.resolve(dataList);
    }, function (err) {
        deferred.resolve(err);
    });

    return deferred.promise;
};

module.exports = TeamService;