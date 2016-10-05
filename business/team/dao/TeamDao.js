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

    if(!TeamModel){
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
TeamDao.prototype.updateById = function(team){
    //TODO
};

//查询工作圈列表
TeamDao.prototype.getTeamList = function(conditions){
    //TODO
};

//根据ID获取工作圈内容
TeamDao.prototype.getTeamById = function(id){
    //TODO
};

module.exports = TeamDao;