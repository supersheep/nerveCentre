var routes = require('../config/routes');


function handle(req){
	for(var i= 0,route;route=routes[i];i++){
		if(route.test.test(req.url))break;
	}
	route = route || routes["default"];
	return function(req,res){
		var router = require("../routes/"+route.name);
		req.router_name = route.name;
		router(req,res);
	}
}

exports.handle = handle;