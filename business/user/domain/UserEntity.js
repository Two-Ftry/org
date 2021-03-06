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
        this.password = obj.password; //用户密码
        this.createTime = obj.createTime;//创建时间
        this.updateTime = obj.updateTime; //更新时间
        this.isOff = obj.isOff; //
        this.isLeave = obj.isLeave; //是否离职
        this.isDelete = obj.isDelete; //是否删除（标记删除，不实际删除）
    }
};

//schema
UserEntity.prototype.getSchema = function() {
    return {
        id:{type: String},
        userName: {type: String},
        phone: {type: String},
        email: {type: String},
        password: {type: String},
        createTime:{type: Date},
        updateTime:{type: Date},
        isOff: {type: Boolean},
        isLeave: {type: Boolean},
        isDelete: {type: Boolean}
    };
};

module.exports = UserEntity;