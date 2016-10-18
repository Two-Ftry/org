/**
 * @desc 组织机构、用户关联实体
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/27.
 */

var OrgUserEntity = function (obj) {
    if(obj){
        this.orgId = obj.orgId; //组织机构ID
        this.userId = obj.userId; //用户ID
        //this.isPrincipal = obj.isPrincipal; //是否是负责人
        this.isPartTime = obj.isPartTime; //是否兼职
    }
};


module.exports = OrgUserEntity;