var

path = require('path');

function handle(req, config){

	var 

	root = path.join(config.origin, '.nc'),

	routes = require( path.join(root, 'routes') );

	for(var i= 0,route;route=routes[i];i++){
		if(route.test.test(req.url)){
			break;
		}
	}
	
	route = route || routes["default"];

	return function(req, res){
		var model = require( path.join( root, 'model', route.model || route.name ) );

		req.router_name = route.name;
        req.dataGetter = route.dataGetter;

		router(req, res);
	}
}

exports.handle = handle;