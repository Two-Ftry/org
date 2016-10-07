/**
 * Created by Administrator on 2016/10/6 0006.
 */

var Query = function () {
};

//schema
Query.prototype.getSchema = function() {
    return {
        start: {type: Number},
        limit:{type: Number},
        keyword:{type: String}
    };
};


module.exports = Query;