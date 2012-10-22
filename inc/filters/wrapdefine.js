var apps = require("../../config/apps"),
	uglify_js = require('uglify-js'),
	jsp = uglify_js.parser,
	pro = uglify_js.uglify,
	globalNameSpace = "DP";

var REGEX_EXECUTOR_REQUIRE = /[^.]\brequire\((["'])([a-zA-Z0-9-\/.~]+)\1\)/g;


function parseRequires(origin){
    var m,
    	deps = [],
    	ast,compressed;

	ast = jsp.parse(origin.toString());
    compressed = pro.gen_code(ast);
    
    while(m = REGEX_EXECUTOR_REQUIRE.exec(compressed)){
    	if(deps.indexOf(m[2]) == -1){
    		deps.push(m[2]);
    	}
    }
    return deps;

};	


function parseId(uri,req){
	var config = req.config;
	var sub_app_uri,app,mod;
	var appbase = config.appbase;
	var libbase = config.libbase;

	if(uri.indexOf(appbase) == 1){
		sub_app_uri = uri.split(appbase)[1].slice(1);
		slash_pos = sub_app_uri.indexOf("/");
		app = sub_app_uri.slice(0,slash_pos);
		mod = sub_app_uri.slice(slash_pos+1,-3);
		return apps.indexOf(app) >= 0 ? (app[0].toUpperCase() + app.slice(1) + "::" + mod) : uri;
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

	var reqs = parseRequires(origin).map(function(req){return "\"" + req + "\"";});
	var id = parseId(uri,req);

	return globalNameSpace+".define(\"" + id + "\",["+reqs.join(",")+"],function(D,require){\n"+origin+"})";
}