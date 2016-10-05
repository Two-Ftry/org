/**
 * Created by Administrator on 2016/10/5 0005.
 */

var express = require('express');
var router = express.Router();
var TeamService = require('../business/team/service/TeamService');
var TeamEntity = require('../business/team/domain/TeamEntity');
var Util = require('../common/Util');

var teamService = new TeamService();

router.post('/save', function (req, res) {
    //获取数据
    var entity = Util.getEntityInstance(req.body, new TeamEntity());
    teamService.save(entity);
    //res.contentType('json');
    //res.send(JSON.stringify({
    //    result: 'success'
    //}));
    //res.end();
    res.json({
        result: 'success'
    })
});

module.exports = router;
