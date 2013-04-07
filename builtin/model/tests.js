var dir_walker = require('../../lib/dir-walker');
var path = require('path');

exports.getData = function(req, config) {
    var dirname = config.test;
    var dir = path.join(config.origin, dirname);
    var list = dir_walker.walk(dir, dirname);

    return {
        list: list,
        json: JSON.stringify(list, null, 4)
    };
};