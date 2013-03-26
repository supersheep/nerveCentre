var require_engine = require('../../lib/require-engine');
var renderer = require('../../lib/renderer');
var toString = Object.prototype.toString;

function isArray(obj){
    return toString.call(obj) === '[object Array]';
};

function makeArray(arr){
    return isArray(arr) ? arr : arr === undefined ? [] : [arr];
};


exports.go = function(req, res) {
    var route = req.route;
    var config = req.config;
    var model_names = makeArray( route.model );

    var data = {
        req: req,
        res: res
    };

    model_names.forEach(function(model_name) {
        model = require_engine.model( config, model_name );

        if ( model ) {
            data[model_name] = model.getData(req, res);

        } else {
            console.log('model not found', model_name);
        }

    });

    req.router_name = route.name;

    renderer.render(route.template, data, res);
};


