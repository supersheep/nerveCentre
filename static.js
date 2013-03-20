var http = require('http'),
	fs = require('fs'),
	mod_url = require('url'),
	mod_path = require('path'),


	fsutil = require("./inc/fs"),
	util = require("./inc/util"),

	filters = require('./inc/filters').filters,

	rewrite = require('./inc/rewrite'),
	reweite_rules = require('./config/rewrite_rules'),

	routesHandler = require('./inc/routesHandler');


function listfilter(origin,root,exclude){
	function dealitem(item){
		var dir = mod_path.dirname(item.path),
			ext = mod_path.extname(item.path),
			basename = mod_path.basename(item.basename,ext);
		item.path = mod_path.join("/",root,dir,basename+".html").replace(/\\/, "/");
		return item;
	}
	if(origin.children){
		origin.children = origin.children.filter(function(item){
			return !exclude.some(function(regexp){
				return regexp.test(item.name) || regexp.test(item.path);
			});
		});

		origin.children.forEach(function(child){
			child = listfilter(child,root,exclude);
		});
	}

	
	return dealitem(origin);
}

function filelist(req,dirname){
	var dir = mod_path.join(req.config.origin,dirname);
	var list = fsutil.list(dir);

	if(list){
		list = listfilter(list,dirname,[/\.DS_Store/]);
	}else{
		list = [];
	}
	return list;
}


function createServer(cfg){
	// 检测是否有新增branch，刷新配置变量
	var onUncaughtException = function(){};

	var server = http.createServer(function(req,res){	
		
		process.removeListener("uncaughtException",onUncaughtException);
		onUncaughtException = function(e){
			res.write(e.stack,"binary");
			res.end();
		}
		process.on("uncaughtException",onUncaughtException);


		// for sending config to routers
		req.config = cfg;

		// TODO:
		// move these slices of code into configurations
		cfg.server = req.headers.host;
		cfg.docs = filelist(req,cfg.doc||"doc");
		cfg.docsjson = JSON.stringify(cfg.docs, null, 4);
		cfg.tests = filelist(req,cfg.test||"test");
		cfg.testsjson = JSON.stringify(cfg.tests, null, 4);
		cfg.demos = filelist(req, cfg.demo || "demo");
		cfg.demosjson = JSON.stringify(cfg.demos, null, 4);

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

		routesHandler.handle(req, cfg)(req,res);

	});


	return server;
}


exports.start = function(cfg){
	createServer(cfg).listen(cfg.port);
	console.log("nervecentre static server started at %d",cfg.port);
};

exports.createServer = createServer;
