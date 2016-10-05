/**
 * Created by Administrator on 2016/10/5 0005.
 */

var Code = function () {};
/**
 *  code的定义
 *  0 - 成功
 *  100 -
 *  200 -
 *  300 -
 *  400 - 找不到对应的接口
 *  500 - 服务器错误
 */
Code.__SUCCESS__ = 0;
Code.__NOT_FOUND__ = 400;
Code.__SERVER_ERROR__ = 500;

module.exports = Code;
