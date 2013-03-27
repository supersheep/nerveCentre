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

    var query = req.queryObj;

    var url = query.url;
    var data_pattern = query.data; 

    // route query.url
    var routes = require_engine.routes(config);

    var i = 0;
    var route;

    for(; route = routes[i]; i++){
        if(route.test.test(url)){
            break;
        }
    }

    route = route || routes.default_route;

    console.log('route', route);

    // get fake model data
    var model_names = makeArray( route.model );

    var data = {};

    model_names.forEach(function(model_name) {
        model = require_engine.model( config, model_name );

        if ( model ) {

            // logic about `req.<data>` has not splitted, so that we will get a 404 not found when fetching data
            data[model_name] = model.getData(req, res);

        } else {
            console.log('model not found', model_name);
        }
    });

    data_pattern.split('.').forEach(function(slice) {
        if(data){
            data = data[slice];
        }
    });

    renderer.render('_.html', {
        data: data,
        req: req,
        res: res
    }, res);
};


