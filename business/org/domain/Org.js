/**
 * @desc 组织机构实体
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/26.
 */

var Org = function (obj) {
    if(obj){
        this.id = obj.id;
        this.name = obj.name; //组织机构名称
        this.parentOrgId = obj.parentOrgId;//父级组织机构ID
        this.isTop = obj.isTop; //是否是顶级组织机构
        this.tid = obj.tid; //组织机构属于哪个团队
        this.createTime = obj.createTime; //创建时间
    }
};

module.exports = Org;