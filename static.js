
var http = require('http');
var Controller = require('./lib/controller');
var http_util = require('./inc/util');

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

		cfg.server = req.headers.host;

		var controller = new Controller(
			// { url: req.url}, 
			req,
			cfg 
		);

		req.config = cfg;

		http_util.write( req, res, controller.get_response() );

	});

	return server;
}


exports.start = function(cfg){
	createServer(cfg).listen(cfg.port);
	console.log("nervecentre static server started at %d", cfg.port);
};

exports.createServer = createServer;
