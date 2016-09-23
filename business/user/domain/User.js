/**
 * @desc 用户实体
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/23.
 */

var User = function (obj) {
    if(obj){
        this.id = obj.id;//用户ID
        this.orgId = obj.orgId;//组织结构ID
        this.userName = obj.userName; //用户名称
        this.phone = obj.phone; //电话号码
        this.email = obj.email; //邮箱
        this.photoUrl = obj.photoUrl;//头像url
        this.orgs = obj.orgs;//处理一个人在多个组织的问题
    }
};



module.exports = User;