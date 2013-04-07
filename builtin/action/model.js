var require_engine = require('../../lib/require-engine');
var Controller = require('../../lib/controller');
var renderer = require('../../lib/renderer');
var toString = Object.prototype.toString;

function isArray(obj){
    return toString.call(obj) === '[object Array]';
};

function makeArray(arr){
    return isArray(arr) ? arr : arr === undefined ? [] : [arr];
};


exports.render = function(info) {
    var route = info.route;
    var config = info.data.config;
    var req = info.data.req;

    var query = req.queryObj;

    var url = query.url;
    var data_pattern = query.data;

    var controller = new Controller({
        url: url
    }, config);

    var data = controller.get_module_data();

    var data_pattern = query.data;
    data_pattern.split('.').forEach(function(slice) {
        if(data){
            data = data[slice];
        }
    });

    return renderer.render('_.html', {
        data: data,
        req: req,
        config: config
    });
};


