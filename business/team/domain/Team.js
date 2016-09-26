/**
 * @desc 团队/工作圈实体
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/26.
 */


var Team = function (obj) {
    if(obj){
        this.id = obj.id;
        this.name = obj.name;//工作圈的名字
        this.type = obj.type; //工作圈的类型
        this.industry = obj.industry; //工作圈所在行业
        this.scale = obj.scale; //工作圈的规模
        this.creator = obj.creator; //工作圈创建者
        this.createTime = obj.createTime; //工作圈的创建时间
        this.updateTime = obj.updateTime; //更新时间
    }
};


module.exports = Team;