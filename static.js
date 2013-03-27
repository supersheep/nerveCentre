var 

http = require('http'),
mod_url = require('url'),
mod_path = require('path'),
require_engine = require('./lib/require-engine'),
rewriter = require('./lib/rewriter'),
controller = require('./lib/controller');


function createServer(cfg){
	// 检测是否有新增branch，刷新配置变量
	var 

	onUncaughtException = function(){},

	server = http.createServer(function(req, res){	
		
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

		// url重写
		rewriter.handle(req, require_engine.rewriteRules(cfg));

		req.queryObj = mod_url.parse(req.url, true).query;

		// debug with query debug
		req.debug = req.queryObj.debug !== undefined;
		
		// assign pathname and position
		req.pathname = decodeURI(mod_url.parse(req.url).pathname);
		
		req.position = mod_path.join(cfg.origin,req.pathname); // 文件路径
		req.extname = mod_path.extname(req.pathname); // 扩展名
		req.filename = mod_path.basename(req.position,req.extname); // 文件名 不包含扩展名
		req.dirpath = mod_path.dirname(req.position); // 文件夹路径
		req.filepath = mod_path.join(req.dirpath,req.filename); //文件路径 不包含扩展名

		// handler routes with routes handler
		controller.handle(req, res);
	});

	return server;
}


exports.start = function(cfg){
	createServer(cfg).listen(cfg.port);
	console.log("nervecentre static server started at %d", cfg.port);
};

exports.createServer = createServer;