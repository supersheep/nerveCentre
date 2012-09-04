var http = require('http'),
	fs = require('fs'),
	mod_url = require('url'),
	mod_path = require('path'),

	util = require("./inc/util"),

	filters = require('./inc/filters').filters,

	rewrite = require('./inc/rewrite'),
	reweite_rules = require('./config/rewrite_rules'),

	routesHandler = require('./inc/routesHandler'),
	routes = require('./config/routes');

function createServer(cfg){
	// 检测是否有新增branch，刷新配置变量
	
	var server = http.createServer(function(req,res){	
		try{	
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
		
		req.position = mod_path.join(cfg.origin,req.pathname); // 文件路径
		req.extname = mod_path.extname(req.pathname); // 扩展名
		req.filename = mod_path.basename(req.position,req.extname); // 文件名 不包含扩展名
		req.dirpath = mod_path.dirname(req.position); // 文件夹路径
		req.filepath = mod_path.join(req.dirpath,req.filename); //文件路径 不包含扩展名

		// handler routes with routes handler
		routesHandler.handle(req)(req,res);

		}catch(e){
			util.write500(req,res,e);
		}

	});


	return server;
}

exports.start = function(cfg){
	createServer(cfg).listen(cfg.port);
	console.log("nervecentre static server started at %d",cfg.port);
}
exports.createServer = createServer;
