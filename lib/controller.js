var path = require('path');
var require_engine = require('./require-engine');

function handle(req, res){
	var config = req.config;
	var root = path.join(config.origin, '.nc');

	// routes
	routes = require_engine.routes(config);

	var i = 0;
	var route;

	console.log('url', req.url);

	for(; route = routes[i]; i++){
		if(route.test.test(req.url)){
			break;
		}
	}
	
	req.route = route = route || routes.default_route;

	var action = require_engine.action(config, route.action);

	action.go(req, res);
}

exports.handle = handle;


