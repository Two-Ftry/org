/**
 * @desc 工作圈服务层
 * Created by Administrator on 2016/10/5 0005.
 */

var TeamService = function(){};
var TeamDao = require('../dao/TeamDao');

var teamDao = new TeamDao();

TeamService.prototype.save = function(team){
    if(!team.createTime){
        team.createTime = new Date();
        team.updateTime = team.createTime;
    }
    teamDao.save(team);
};

module.exports = TeamService;