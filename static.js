var http = require('http'),
	fs = require('fs'),
	mod_url = require('url'),
	mod_path = require('path'),


	fsutil = require("./inc/fs"),
	util = require("./inc/util"),

	filters = require('./inc/filters').filters,

	rewrite = require('./inc/rewrite'),
	reweite_rules = require('./config/rewrite_rules'),

	routesHandler = require('./inc/routesHandler'),
	routes = require('./config/routes');


function listfilter(origin,root,exclude){
	return origin.filter(function(item){
		return !exclude.some(function(regexp){
			return regexp.test(item.name) || regexp.test(item.path);
		});
	}).map(function(item){
		var dir = mod_path.dirname(item.path),
			ext = mod_path.extname(item.path),
			basename = mod_path.basename(item.path,ext);

		item.path = mod_path.join("/",root,dir,basename+".html");
		return item;
	});
}

function all_docs(req){
	var dir = mod_path.join(req.config.origin,"docs");
	var docs = fsutil.list(dir);
	var docs = listfilter(docs,"docs",[/\.DS_Store/,/^$/]);
	
	return docs;
}

function all_tests(req){
	var dir = mod_path.join(req.config.origin,"test");
	var tests = fsutil.list(dir);
	var tests = listfilter(tests,"test",[/\.DS_Store/,/txt$/,/^$/]);
	return tests;
}

function createServer(cfg){
	// 检测是否有新增branch，刷新配置变量
	
	var server = http.createServer(function(req,res){	
		try{	

		// for sending config to routers
		req.config = cfg;

		cfg.server = req.headers.host;
		cfg.docs = all_docs(req);
		cfg.tests = all_tests(req);


		// url重写
		rewrite.handle(req,reweite_rules);	
	

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
