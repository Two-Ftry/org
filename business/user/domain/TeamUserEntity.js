/**
 * @desc 工作圈-用户实体（关联表）
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/27.
 */

var TeamUserEntity = function (obj) {
    if(obj){
        this.tid = obj.tid; //工作圈ID
        this.userId = obj.userId; //用户ID
        this.isInit = obj.isInit; //是否是默认的工作圈
    }
};

module.exports = TeamUserEntity;
