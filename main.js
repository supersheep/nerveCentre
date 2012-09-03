var http = ncrequire('http'),
	fs = ncrequire('fs'),	
	default_config = ncrequire('./config').configs,
	staticServer = ncrequire('./static'),
	
	proxyServer = ncrequire('./proxy'),
	proxyRouter = ncrequire('./proxyRoutes').routes;


function deepExtend(destination, source) {
  for (var property in source) {
    if (typeof source[property] === "object") {
      destination[property] = destination[property] || {};
      arguments.callee(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
}

function getConfig(key){
	var config =  deepExtend({},default_config);
	if(key){
		return config[key];
	}else{
		return config;
	}
}

function startServer(cfg){
	var config = deepExtend(default_config,cfg);
	var PORT_STATIC = config.useproxy?config.staticport:config.port,
		PORT_CONFIG = config.port;

	staticServer.createServer(cfg).listen(PORT_STATIC);
	console.log("static started at %d ",PORT_STATIC);
	
	// now the proxy
	if(config.useproxy){
		proxyServer.proxy("127.0.0.1",PORT_STATIC,proxyRouter).listen(PORT_CONFIG);
		console.log("proxy started at %d ",PORT_CONFIG);
	}
	
	console.log('nerveCentre started at %d , %s ;)',PORT_CONFIG,config.origin);
}




module.exports = {
	getConfig:getConfig,
	start:startServer
}