var 

// apps = require("../../config/apps"),
uglify_js = require('uglify-js'),
jsp = uglify_js.parser,
pro = uglify_js.uglify,
globalNameSpace = "NR";

var REGEX_EXECUTOR_REQUIRE = /[^.]\brequire\((["'])([a-zA-Z0-9-\/.~]+)\1\)/g;


function standardize(origin){
    var ast = jsp.parse(origin.toString());
    return pro.gen_code(ast);
};

function parseRequires(code){
    var m,
        deps = [];
    
    while(m = REGEX_EXECUTOR_REQUIRE.exec(code)){
        if(deps.indexOf(m[2]) == -1){
            deps.push(m[2]);
        }
    }
    return deps;
};


function parseId(uri, config){
    // var config = req.config;
    var appbase = config.appbase;
    var libbase = config.libbase;
    var index;

    // uri: /src/app/nc/index.js
    if( ( index = uri.indexOf(appbase) ) !== -1){

        //  / + src/app + /
        return uri.slice(appbase.length + index + 1).replace('/', '::').split('.js')[0];

    }else if( ( index = uri.indexOf(libbase) ) !== -1){

        return uri.slice(libbase.length + index + 1).split(".js")[0];
    }
}

// libbase -> lib
// appbase -> app
// 
// @param {string} origin original code
module.exports = function(origin, uri, config){ 
    // uri: "/lib/util/cookie.js"
    // id: "util/cookie"
    // 
    // uri: "/s/j/app/shop/mylist-app.js"
    // id: "Shop::mylist-app"

    var code = standardize(origin),
        reqs = parseRequires(code).map(function(req){return "\"" + req + "\"";});
    var id = parseId(uri, config);

    // var config = req.config;

    var includes = [config.appbase, config.libbase];
    var excludes = ["neuron.js","jasmine"];

    function inPath(uri,str){
        return uri.indexOf(str) !== -1;
    }

    function shouldWrap(uri){
        var inIncludes = includes.some(function(str){
            return inPath(uri,str);
        });

        var notInExcludes = excludes.every(function(str){
            return !inPath(uri,str);
        });

        return inIncludes && notInExcludes;
    }

    if(shouldWrap(uri)){
    
        return globalNameSpace+".define(\"" + id + "\",["+reqs.join(",")+"],function(require, exports, module){var $ = NR.DOM;\n" + origin + "\n})";

    }else{
        return origin;
    }
}