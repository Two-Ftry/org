/**
 * @desc 用户实体
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/23.
 */

var UserEntity = function (obj) {
    if(obj){
        this.id = obj.id;//用户ID
        this.userName = obj.userName; //用户名称
        this.phone = obj.phone; //电话号码
        this.email = obj.email; //邮箱
        //this.photoUrl = obj.photoUrl;//头像url

        //组织机构相关
        //this.orgId = obj.orgId;//组织结构ID
        //this.orgIds = obj.orgIds;//处理一个人在多个组织的问题
        //
        ////工作圈相关
        //this.tid = obj.tid;//当前工作圈id
        //this.tids = obj.tids;//当前用户所在工作圈的id数组
        //this.initTid = obj.initTid; //用户登录时默认的工作圈id

        this.createTime = obj.createTime;//创建时间
        this.updateTime = obj.updateTime; //更新时间
    }
};

module.exports = UserEntity;