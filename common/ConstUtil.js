/**
 * @desc 常亮JS
 * Created by Administrator on 2016/10/6 0006.
 */

var ConstUtil = function () {

};

//查询从哪一条开始
ConstUtil.__PAGE_START__ = 0;
//查询的默认限制数量
ConstUtil.__PAGE_LIMIT__ = 10;
//用户信息
ConstUtil.__USER_INFO__ = 'userInfo';
//防止csrf攻击的随机码
ConstUtil.__CSRF__ = '_csrf';

module.exports = ConstUtil;

