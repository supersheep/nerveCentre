var http = require('http'),
	fs = require('fs'),
	mod_url = require('url'),
	mod_path = require('path'),

	filters = require('./inc/filters').filters,

	rewrite = require('./inc/rewrite'),
	reweite_rules = require('./config/rewrite_rules'),

	routesHandler = require('./inc/routesHandler'),
	routes = require('./config/routes');

function createServer(cfg){
	// 检测是否有新增branch，刷新配置变量
	
	var server = http.createServer(function(req,res){	
		
		var pathname,
			position;
		
		cfg.server = req.headers.host;
		
		// url重写
		rewrite.handle(req,reweite_rules);	
	
		// for sending config to routers
		req.config = cfg;

		// debug with query debug
		req.debug = mod_url.parse(req.url,true).query.debug !== undefined;
		
		// assign pathname and position
		req.pathname = decodeURI(mod_url.parse(req.url).pathname);
		req.position = cfg.origin + req.pathname;

		// handler routes with routes handler
		routesHandler.handle(req)(req,res);
	});
	return server;
}

exports.start = function(cfg){
	createServer(cfg).listen(cfg.port);
	console.log("nervecentre static server started at %d",cfg.port);
}
exports.createServer = createServer;
