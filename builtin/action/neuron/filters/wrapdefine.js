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


function parseId(uri, req){
    var config = req.config;
    var appbase = config.appbase;
    var libbase = config.libbase;

    // uri: /src/app/nc/index.js
    if(uri.indexOf(appbase) === 1){

        //  / + src/app + /
        return uri.slice(appbase.length + 2).replace('/', '::').split('.js')[0];

    }else if(uri.indexOf(libbase) == 1){

        return uri.split(libbase)[1].slice(1).split(".js")[0];
    }
}

// libbase -> lib
// appbase -> app
// 
// 
module.exports = function(origin,uri,req){
    // uri: "/lib/util/cookie.js"
    // id: "util/cookie"
    // 
    // uri: "/s/j/app/shop/mylist-app.js"
    // id: "Shop::mylist-app"

    var code = standardize(origin),
        reqs = parseRequires(code).map(function(req){return "\"" + req + "\"";});
    var id = parseId(uri,req);

    var config = req.config;

    var includes = [config.appbase, config.libbase];
    var excludes = ["neuron","jasmine"];

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

    if(shouldWrap(uri) && code.indexOf(globalNameSpace + ".define") === -1){
    
        return globalNameSpace+".define(\"" + id + "\",["+reqs.join(",")+"],function(require, exports, module){var $ = NR.DOM;\n"+origin+"})";
    }else{
        return origin;
    }
}