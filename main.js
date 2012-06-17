var http = require('http'),
	fs = require('fs'),
	
	config = require('./config').configs,
	
	staticServer = require('./static'),
	
	proxyServer = require('./proxy'),
	proxyRouter = require('./proxyRoutes').routes;



var PORT_STATIC = config.useproxy?config.staticport:config.port,
	PORT_CONFIG = config.port;

var CONFIG_PROXY_RULES;

function startServer(){
	
	staticServer.createServer().listen(PORT_STATIC);
	console.log("static started at %d ",PORT_STATIC);
	
	// now the proxy
	if(config.useproxy){
		proxyServer.proxy("127.0.0.1",PORT_STATIC,proxyRouter).listen(PORT_CONFIG);
		console.log("proxy started at %d ",PORT_CONFIG);
	}
	
	console.log('nerveCentre started at %d. ;)',PORT_CONFIG);
}

exports = {
	start:startServer
}