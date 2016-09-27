/**
 * @desc 角色和用户的关联实体
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/27.
 */

var RoleUserEntity = function(obj){
    if(obj){
        this.roleId = obj.roleId; //角色ID
        this.userId = obj.userId; //用户ID
        this.relateId = obj.relateId; //关联的ID - 管理员-圈ID  负责人-orgId  兼职-orgId
    }
};

module.exports = RoleUserEntity;