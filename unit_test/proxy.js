require("chai").should();
var worker = require("../worker");

var proxy = require("../proxy");
var proxyRoutes = require("../proxyRoutes");

var routeParser = proxy.routeParser;
var routes = proxyRoutes.routes;

worker.start("proxy_rules");

describe("RouteParser",function(){

	
	it("branch to app branch",function(){
		routeParser(routes,"/branch/pic/s/j/app/promo/mbox.js").should
		.equal("/branch/promo/s/j/app/promo/mbox.js?from=/branch/pic/s/j/app/promo/mbox.js");
	});
	
	it("branch to neuron",function(){
		routeParser(routes,"/branch/pic/lib/fx/core.js").should
		.equal("/branch/neuron/lib/fx/core.js?from=/branch/pic/lib/fx/core.js");
	});
	
	it("branch to app branch",function(){
		routeParser(routes,"da").should
		.equal("bas?from=da");
	});
	
	
});


