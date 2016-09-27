/**
 * @desc 头像用户实体
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/27.
 */

var PhotoUserEntity = function (obj) {
  if(obj){
      this.photoId = obj.photoId; //头像ID
      this.userId = obj.userId; //用户ID
      this.isUsing = obj.isUsing; //是否正在使用中
  }
};

module.exports = PhotoUserEntity;