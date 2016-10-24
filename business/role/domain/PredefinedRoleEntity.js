/**
 * @desc 系统定义的角色实体表
 * Created by Administrator on 2016/10/24 0024.
 */

var PredefinedRoleEntity =  function (obj) {
    if(obj){
        this.id = obj.id;
        this.code = obj.code; //角色编码
        this.name = obj.name; //角色名称(管理员、负责人)
        this.isSys = obj.isSys; //是否是系统定义的角色
        this.remark = obj.remark; //备注
    }
};

//schema
PredefinedRoleEntity.prototype.getSchema = function(){
    return {
        id:{type: String},
        code: {type: String},
        name:{type: String},
        isSys:{type: Boolean},
        remark: {type: String}
    };
};

module.exports = PredefinedRoleEntity;