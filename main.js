var config = require('./inc/config').configs,
	http = require('http'),
	fs = require('fs'),
	statics = require('./static');

var l = JSON.parse(fs.readFileSync('count_log.txt','binary'));
function log(u){
	var c = parseInt(l[u]);
	if(!c){
		l[u] = 1;
	}else{
		l[u] = parseInt(l[u]) + 1;
	}
}


statics.createServer().listen(config.useproxy?config.staticport:config.port);


// now the proxy
config.useproxy

&&

http.createServer(function(req,res){
	var options = {
		host:'127.0.0.1',
		port:config.staticport,
		method:'GET',
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
		console.log(ret,url);
		return ret;
		
	}
	
	var proxy_req = http.request(options,function(proxy_res){
		
		proxy_res.on('data',function(chunk){
			res.write(chunk,'binary');
		});
		
		proxy_res.on('end',function(){
			res.end();
		});
	});
	
	log(req.url);
	
	proxy_req.on('error',function(err){
		console.log('err:',err);
	});
	
	proxy_req.end();
	
}).listen(config.port);
console.log('nerveCentre started at %d, ;)',config.port);
setInterval(function(){
	fs.writeFileSync('count_log.txt',JSON.stringify(l));
},1000);
