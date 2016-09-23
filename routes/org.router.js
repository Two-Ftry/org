/**
 * @desc
 * @require
 * @author jianfeng_huang.
 * @date 2016/9/23.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.send('org router');
});

module.exports = router;
