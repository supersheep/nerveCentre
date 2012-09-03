var worker = require('./worker'),
	http = require('http');
	log = require('./inc/log');

function routeParser(routes,url){
	
	var proxyto,
		_ret, // ret in config
		_test, // test in config
		ret, // real ret function
		test; // real test function
	
	for(var i = 0,route ;route = routes[i]; i++){
	
		_test = route.test;
		_ret = route.ret;
		// 暂时只定义正则和函数两种形式，没有用到的情况先不实现
		if(_test.constructor == RegExp){
			ret = function(){
				return url.replace(_test,_ret);
			}
			
			test = function(url){
				return _test.test(url);
			}
		}else if(_test.constructor == Function){
			test = _test;
			ret = _ret;
		}else{
			throw "routes test for proxy parser can only be regexp or function, given " + _test.toString() ;
		}
		
		
		if(test(url)){
			proxyto = ret(url);
			break;
		}
	}
	
	proxyto = proxyto || url;
	
	proxyto = proxyto + '?from=' + url;
	return proxyto;
}
	

var proxy = function(host,port,routes){
	worker.start("proxy_rules");
	return http.createServer(function(req,res){
		var pathto = routeParser(routes,req.url);
		log.write("Proxy to %s",pathto);
		var options = {
			host:host,
			port:port,
			method:'GET',
			headers:req.headers,
			path:pathto
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
	});
}


exports.proxy = proxy;
exports.routeParser = routeParser;