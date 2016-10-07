/**
 * Created by Administrator on 2016/10/5 0005.
 */

var express = require('express');
var router = express.Router();
var TeamService = require('../business/team/service/TeamService');
var TeamEntity = require('../business/team/domain/TeamEntity');
var Util = require('../common/Util');
var Code = require('../common/domain/Code');
var Result = require('../common/domain/Result');
var Query = require('../common/domain/Query');

var teamService = new TeamService();

router.post('/save', function (req, res) {
    //获取数据
    var entity = Util.getEntityInstance(req.body, new TeamEntity());
    teamService.save(entity);
    res.json({
        result: 'success'
    })
});

router.post('/deleteById', function(req, res){
    var id = req.body.id;
    if(id){
        teamService.deleteById(id).then(function(data){
            res.send(new Result({
                code: Code.__SUCCESS__
            }));
        }, function (err) {
            res.send(new Result({
                code: Code.__SERVER_ERROR__,
                err: err,
                msg: ''
            }));
        });
    }else{
        res.send(new Result({
            code: Code.__NOT_FOUND__,
            msg: 'Id cannot be empty'
        }));
    }
});

/**
 * 根据ID获取工作圈信息
 */
router.post('/getTeamById', function (req, res) {
    var id = req.body.id;
    if(id){
        teamService.getTeamById(id).then(function(data){
            if(data){
                res.send(new Result({
                    code: Code.__SUCCESS__,
                    data: data
                }));
            }else{
                res.send(new Result({
                    code: Code.__SERVER_ERROR__,
                    msg: 'Cannot find data'
                }));
            }
        }, function (err) {
            res.send(new Result({
                code: Code.__SERVER_ERROR__,
                err: err,
                msg: ''
            }));
        });
    }else{
        res.send(new Result({
            code: Code.__NOT_FOUND__,
            msg: 'Id cannot be empty'
        }));
    }
});

/**
 * 根据ID更新工作圈信息
 */
router.post('/updateTeamById', function (req, res) {
    var team = Util.getEntityInstance(req.body, new TeamEntity(), true);
    if(team && team.id){
        teamService.updateTeamById(team).then(function(data){
            if(data){
                res.send(new Result({
                    code: Code.__SUCCESS__,
                    data: data
                }));
            }else{
                res.send(new Result({
                    code: Code.__SERVER_ERROR__,
                    msg: 'Cannot find data'
                }));
            }
        }, function (err) {
            res.send(new Result({
                code: Code.__SERVER_ERROR__,
                err: err,
                msg: ''
            }));
        });
    }else{
        res.send(new Result({
            code: Code.__NOT_FOUND__,
            msg: 'router id cannot be empty'
        }));
    }
});

/**
 * 根据ID更新工作圈信息
 */
router.post('/getTeamList', function (req, res) {
    var query = Util.getEntityInstance(req.body, new Query());
    teamService.getTeamList(query).then(function(data){
        if(data){
                res.send(new Result({
                    code: Code.__SUCCESS__,
                    data: data
                }));
            }else{
                res.send(new Result({
                    code: Code.__SERVER_ERROR__,
                    msg: 'Cannot find data'
                }));
            }
        }, function (err) {
            res.send(new Result({
                code: Code.__SERVER_ERROR__,
                err: err,
                msg: ''
            }));
        });

});

module.exports = router;
