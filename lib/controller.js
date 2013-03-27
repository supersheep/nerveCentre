var require_engine = require('./require-engine');

function handle(req, res){
	var config = req.config;
	var pathname = req.pathname;

	// routes
	var routes = require_engine.routes(config);

	var i = 0;
	var route;

	for(; route = routes[i]; i++){
		if(route.test.test(pathname)){
			break;
		}
	}
	
	req.route = route = route || routes.default_route;

	var action = require_engine.action(config, route.action);

	action.go(req, res);
}

exports.handle = handle;


