/**
 * @desc 用户Entity实体（对应表）
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/27.
 */
var OrgEntity = function (obj) {
    if(obj){
        this.id = obj.id;
        this.name = obj.name; //组织机构名称
        this.parentOrgId = obj.parentOrgId;//父级组织机构ID
        this.isTop = obj.isTop; //是否是顶级组织机构
        this.tid = obj.tid; //组织机构属于哪个团队
        this.createTime = obj.createTime; //创建时间
        this.updateTime = obj.updateTime; //修改时间
    }
};

module.exports = OrgEntity;