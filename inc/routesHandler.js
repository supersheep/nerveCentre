var

path = require('path');

function handle(req, config){

	var routes = require( path.join(config.origin, '.nc/routes') );

	for(var i= 0,route;route=routes[i];i++){
		if(route.test.test(req.url)){
			break;
		}
	}
	route = route || routes["default"];
	return function(req, res){
		var router = require("../routes/"+ (route.action || route.name) );

		req.router_name = route.name;
        req.dataGetter = route.dataGetter;

		router(req, res);
	}
}

exports.handle = handle;