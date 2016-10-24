/**
 * @desc
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/23.
 */
var express = require('express');
var router = express.Router();

var OrgService = require('../business/org/service/OrgService');
var OrgEntity = require('../business/org/domain/OrgEntity');
var Util = require('../common/Util');

var orgService = new OrgService();

/**
 * 新建Org
 */
router.post('/save', function (req, res) {
    var entity = Util.getEntityInstance(req.body, new OrgEntity());
    orgService.save(entity).then(function (data) {
        res.send(data);
    }, function (err) {
        console.log('org router', err);
        res.send(err);
    });

});

/**
 * 根据Id获取Org信息
 */
router.post('/getOrgById', function (req, res) {
   var id = req.body.id;
    orgService.getOrgById(id).then(function (data) {
        res.send(data);
    }, function (err) {
        res.send(err);
    })
});

/**
 * 更新org信息
 */
router.post('/updateOrgById', function (req, res) {
    var org = Util.getEntityInstance(req.body, new OrgEntity(), true);
    orgService.updateOrgById(org).then(function (data) {
        res.send(data);
    }, function (err) {
        res.send(err);
    })
});

/**
 * 根据tid获取org信息
 */
router.post('/getTopOrgByTid', function (req, res) {
   var tid = req.body.tid;
    orgService.getTopOrgByTid(tid).then(function (data) {
        res.send(data);
    }, function (err) {
        res.send(err);
    });
});

/**
 * 根据id删除组织机构
 */
router.post('/deleteById', function (req, res) {
    var id = req.body.id;
    orgService.deleteById(id).then(function (data) {
        res.send(data);
    }, function (err) {
        res.send(err);
    });
});

/**
 * 根据id删除组织机构
 */
router.post('/getOrgsByTid', function (req, res) {
    var tid = req.body.tid;
    var start = req.body.start;
    var limit = req.body.limit;
    orgService.getOrgsByTid({
        tid: tid,
        start: start,
        limit: limit
    }).then(function (data) {
        res.send(data);
    }, function (err) {
        res.send(err);
    });
});

/**
 * 根据父组织机构ID，获取自组织ID
 */
router.post('/getSubOrgsByParentOrgId', function (req, res) {
   var parentOrgId = req.body.parentOrgId;
    var isPaging = req.body.isPaging;
    var start = req.body.start;
    var limit = req.body.limit;
    orgService.getSubOrgsByParentOrgId({
        parentOrgId: parentOrgId,
        start: start,
        limit: limit
    }, isPaging).then(function (data) {
        res.send(data);
    }, function(err){
        res.send(err);
    });

});

module.exports = router;
