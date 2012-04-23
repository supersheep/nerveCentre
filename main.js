var config = require('./inc/config').configs,
	http = require('http'),
	fs = require('fs'),
	statics = require('./static');

var PORT_STATIC = config.useproxy?config.staticport:config.port,
	PORT_CONFIG = config.port;
	
statics.createServer().listen(PORT_STATIC);


// now the proxy
if(config.useproxy){
	
	http.createServer(function(req,res){
		var options = {
			host:'127.0.0.1',
			port:config.staticport,
			method:'GET',
			headers:req.headers,
			path:parseUrl(req.url)
		}
		
		function parseUrl(url){
			var REG_NEURON_APP = /^\/branch\/neuron\/s\/j\/app\/(.+)/,
				REG_APP_LIB = /^\/branch\/\w+\/lib\/(.+)/,
				ret;
			
			if(REG_NEURON_APP.test(url)){
				ret = '/trunk/s/j/app/' + url.match(REG_NEURON_APP)[1];
			}else if(REG_APP_LIB.test(url)){
				ret = '/trunk/lib/' + url.match(REG_APP_LIB)[1];
			}else{
				ret = url;
			}
			
			ret = ret + '?from=' + url;
			return ret;
			
		}
		
		var proxy_req = http.request(options,function(proxy_res){
			
			var headers = proxy_res.headers;
			
			for(var key in headers){
				res.setHeader(key,headers[key]);
			}
			
			res.statusCode = proxy_res.statusCode;		
			
			proxy_res.on('data',function(chunk){
				res.write(chunk,'binary');
			});
			
			proxy_res.on('end',function(){
				res.end();
			});
		});
		
		proxy_req.on('error',function(err){
			console.log('err:',err);
		});
		
		proxy_req.end();
		
	}).listen(config.port);
	
	console.log('proxy started at %d',PORT_CONFIG);
}

console.log('nerveCentre started at %d, ;)',PORT_CONFIG);
