/**
 * Created by Administrator on 2016/10/7 0007.
 */


var DaoUtil = require('../../../common/DaoUtil');
var Util = require('../../../common/Util');

var OrgDao = function () {};
var _tableName = 'f_crm_org';
var OrgEntity = require('../domain/OrgEntity');

var OrgModel = null;

/**
 * 新建Org
 * @param org
 */
OrgDao.prototype.save = function(org){
    if(!org){
        return;
    }
    if(!OrgModel){
        var schema = new OrgEntity().getSchema();
        OrgModel = DaoUtil.getModel(schema, _tableName);
    }
    var entity = new OrgModel(org);
    entity.save();

    return entity;
};

/**
 * 根据Id更新Org信息
 * @param org
 */
OrgDao.prototype.updateOrgById = function(org){
    //TODO
};

/**
 * 根据Id删除Org
 * @param id
 */
OrgDao.prototype.deleteById = function (id) {
    //TODO
};

/**
 * 根据Id获取Org信息
 * @param id
 */
OrgDao.prototype.getOrgById = function(id){
  //TODO
};

/**
 * 根据父org的id查询所有下属org信息
 * @param id
 */
OrgDao.prototype.getSubOrgsByParentOrgId = function (id) {
    //TODO
};

/**
 * 根据tid（工作圈id）获取第一级组织机构的信息(每个tid只有一个top org)
 * @param tid
 */
OrgDao.prototype.getTopOrgByTid = function (tid) {
    //TODO
};

/**
 * 根据tid一次性查出组织机构的所有信息
 * @param tid
 */
OrgDao.prototype.getOrgsByTid = function (tid) {
    //TODO
};

module.exports = OrgDao;