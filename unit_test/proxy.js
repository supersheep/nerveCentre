ncrequire("chai").should();
var worker = ncrequire("../worker");

var proxy = ncrequire("../proxy");
var proxyRoutes = ncrequire("../proxyRoutes");

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
	
	it("custom proxy rules",function(){
		routeParser(routes,"/branch/shop/s/js/g.dp.js").should
		.equal("/branch/main/s/js/g.dp.js?from=/branch/shop/s/js/g.dp.js");
		
		routeParser(routes,"/branch/index/s/js/g.dp.js").should
		.equal("/branch/main/s/js/g.dp.js?from=/branch/index/s/js/g.dp.js");
	
		
		routeParser(routes,"/branch/index/s/css/g.base.css").should
		.equal("/branch/main/s/css/g.base.css?from=/branch/index/s/css/g.base.css");
		
	});
	
	
});


