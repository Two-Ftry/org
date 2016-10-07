/**
 * Created by Administrator on 2016/10/5 0005.
 */
var Q = require('q');
var Code = require('../../../common/domain/Code');
var Result = require('../../../common/domain/Result');

var TeamDao = function(){};
var _teamTableName = 'f_crm_team';
var DaoUtil = require('../../../common/DaoUtil');
var TeamEntity = require('../domain/TeamEntity');

var TeamModel = null;

//保存工作圈内容
TeamDao.prototype.save = function(team){
    if(!team){
        return;
    }
    var teamSchema = new TeamEntity().getSchema();
    if(!TeamModel){
        TeamModel =  DaoUtil.getModel(teamSchema, _teamTableName);
    }
    var entity = new TeamModel(team);
    entity.save();
};

//根据ID删除工作圈
TeamDao.prototype.deleteById = function(id){
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

    if(!TeamModel){
        var teamSchema = new TeamEntity().getSchema();
        TeamModel =  DaoUtil.getModel(teamSchema, _teamTableName);
    }

    TeamModel.findByIdAndRemove(id, function(err){
        if(err){
            console.log('del by Id:', err);
            deferred.reject(new Result({
                code: Code.__SERVER_ERROR__,
                error: err,
                msg: ''
            }));
        }else{
            console.log('dao 删除成功!!');
            deferred.resolve(new Result({
                code: Code.__SUCCESS__
            }));
        }
    });
    return deferred.promise;
};

//更新工作圈
TeamDao.prototype.updateTeamById = function(team){
    var deferred = Q.defer();

    if(!team || !team.id){
        setTimeout(function () {
            deferred.reject(new Result({
                code: Code.__NOT_FOUND__,
                msg: 'dao id cannot be empty'
            }));
        }, 200);
        return deferred.promise;
    }

    if(!TeamModel){
        var teamSchema = new TeamEntity().getSchema();
        TeamModel =  DaoUtil.getModel(teamSchema, _teamTableName);
    }

    TeamModel.findByIdAndUpdate(team.id, team, function (err, data) {
        if(err){
            deferred.reject(err);
        } else{
            deferred.resolve(data);
        }
    });

    return deferred.promise;
};

//查询工作圈列表
TeamDao.prototype.getTeamList = function(query){
    var deferred = Q.defer();
    var _query = {
    };

    if(query.keyword){
        var keywordStr = '/' + query.keyword + '/i';
        _query = {
            "$or":[
                {name: eval(keywordStr)},
                {type: eval(keywordStr)},
                {industry: eval(keywordStr)},
                {scale: eval(keywordStr)}
            ]
        };
    }

    if(!TeamModel){
        var teamSchema = new TeamEntity().getSchema();
        TeamModel =  DaoUtil.getModel(teamSchema, _teamTableName);
    }

    TeamModel.find(_query, null, {skip: query.start, limit: query.limit}, function(err, dataList){
        if(err){
            console.log('dao getImgList', err);
            deferred.reject(err);
        }else{
            TeamModel.count(_query, function(err, count){
                if(err){
                    console.log('dao getImgList count', err);
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

//根据ID获取工作圈内容
TeamDao.prototype.getTeamById = function(id){
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

    if(!TeamModel){
        var teamSchema = new TeamEntity().getSchema();
        TeamModel =  DaoUtil.getModel(teamSchema, _teamTableName);
    }

    TeamModel.findById(id, function (err, team) {
       if(err){
           deferred.reject(err);
       } else{
            deferred.resolve(team);
       }
    });

    return deferred.promise;
};

module.exports = TeamDao;