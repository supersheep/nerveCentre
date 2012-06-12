var config = require('./inc/config').configs,
	http = require('http'),
	fs = require('fs'),
	statics = require('./static');

var PORT_STATIC = config.useproxy?config.staticport:config.port,
	PORT_CONFIG = config.port;
	
statics.createServer().listen(PORT_STATIC);


var CONFIG_PROXY_RULES;

function setConfigProxyRules(){
	var rules = config.custom_proxy_rules,
		content,rules_list;
		
	CONFIG_PROXY_RULES = {};
		
	content = fs.readFileSync(rules,'binary');
	if(!content){
		content = "";
	}
	
	rules_list = content.split('\n');
	
	rules_list.forEach(function(e){
		var splited = e.split('|');
		if(splited.length == 2){
			CONFIG_PROXY_RULES[splited[0]] = splited[1];
		}
	});
}

// now the proxy
if(config.useproxy){
	
	setConfigProxyRules();
	http.createServer(function(req,res){
		var options = {
			host:'127.0.0.1',
			port:config.staticport,
			method:'GET',
			headers:req.headers,
			path:parseUrl(req.url)
		}
		
		/**
		 * 1. branch/foo/lib/ -> branch/neuron/lib
		 * 2. branch/foo/s/j/app/ -> branch/app/s/j/app
		**/
		function parseUrl(url){
			var REG_APP = /^\/branch\/(\w+)\/s\/j\/app\/(\w+)\/(.+)/,
				REG_LIB = /^\/branch\/(\w+)\/lib\/(.+)/,
				matches,
				ret;
			
			// 配置规则
			if(CONFIG_PROXY_RULES[req.url]){
				ret = CONFIG_PROXY_RULES[req.url];
			}else if(REG_APP.test(url)){
				matches = url.match(REG_APP);
				ret = '/branch/' + matches[2] + '/s/j/app/' + matches[2] + '/' + matches[3];
			}else if(REG_LIB.test(url)){
				ret = '/branch/neuron/lib/' + url.match(REG_LIB)[2];
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


fs.watch(config.custom_proxy_rules, {},function (curr, prev) {
	if(curr.mtime - prev.mtime){
		setConfigProxyRules();
		console.log(new Date(),'CONFIG_PROXY_RULES set to be',CONFIG_PROXY_RULES);
	}
});

console.log('nerveCentre started at %d, ;)',PORT_CONFIG);

