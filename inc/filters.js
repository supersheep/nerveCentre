var uglifyjs = require('./uglifyjs/uglify-js');
var config = require('./config').configs;
var url = require('url');

var filters = {
	// use uglify to compress .min files
	uglify:function(origin,url){			
	try{	
		var jsp = uglifyjs.parser;
		var pro = uglifyjs.uglify;
		var ast = jsp.parse(origin);
		var finalcode;
		if(url.match(/\.min.*\.(js|css)$/)){		
			ast = pro.ast_mangle(ast);
			ast = pro.ast_squeeze(ast);
			final_code = pro.gen_code(ast);
			return final_code;
		}else{
			return origin;
		}
	}catch(e){
		return origin;	
	}
	},
	// replace the fake %buidtime%
	buildtime:function(origin,url){
		var date = new Date();
		var timestr = date.getFullYear()
		+"-"+(date.getMonth()+1) 
		+"-"+date.getDate()
		+" "+fill(date.getHours())
		+":"+fill(date.getMinutes())
		+":"+fill(date.getSeconds());
		function fill(s){
			return s.toString().length<2?("0"+s):s;
		}
		return origin.replace(/%buildtime%/, timestr);
	},
	// add use strict on top of the script
	strict:function(origin,url){
		function need_strict(url){
			for(var i = 0,l=config.libpath.length;i<l;i++){			
				if(url.match(config.libpath[i])){
					return true;
				}
			}
			return false;
		}
		
		return need_strict(url) ? ("\"use strict\";\r\n"+origin) : origin;
	},
	
	// replace the fake branch
	branch:function(origin,uri){
		var match,base,ret,
			parsed = url.parse(uri,true),
			pathname = parsed.pathname,
			query = parsed.query,
			from = query.from,
			PATH_NEURON = /\/neuron\.js$/.test(pathname),
			FROM_NEURON = /\/neuron\.js$/.test(from),
			USE_PROXY = config.useproxy;
			
		
		if( !USE_PROXY && PATH_NEURON){
			console.log(pathname);
			base = pathname.match(/(?:\/branch\/[^\/]*|\/trunk)\//)[0];
			ret = origin.replace(/\/\*branch-base\*\/'([^']*)'/,'\''+ base +'\'')
		}else if( USE_PROXY && FROM_NEURON ){
			base = from.match(/(?:\/branch\/[^\/]*|\/trunk)\//)[0];
			ret = origin.replace(/\/\*branch-base\*\/'([^']*)'/,'\''+ base +'\'')
		}else{
			ret = origin;
		}
		
		return ret;
	}
}

exports.filters = filters;
