var fs = require('fs'),
	url = require('url'),
	path = require('path'),
	util = require('../inc/util'),	
	config = require('../config').configs;

function dir(req,res){
	var pathname = req.pathname,
		dir,toconcat,code;
		
	dir = (config.origin + pathname).split('.js')[0];
	if(path.existsSync(dir)){
			
		
		//找出文件夹下的js们			
		toconcat = fs.readdirSync( dir ).filter(function(e){
			return e.indexOf('.js') > 0;
		}).map(function(e){
			return dir + '/' + e;
		});
			
		filedata = "DP.define.on();\n";
				
		// /branch/coupon | /trunk
		var modulebase = dir.match(/(?:\/branch\/[^\/]*|\/trunk)\//);
		
		modulebase = modulebase ? modulebase[0] : "";
			
		// 修改DP.define语句，以文件名定义模块
		filedata += util.concatFiles(toconcat,function(file,p){
			// /switch | /io
			var moduleName =  p.split(modulebase)[1];
			return file.replace(/(KM|DP)\.define\(/,"DP.define('" + moduleName + "',");
		});	
		
		filedata += "DP.define.off();";
		filedata = util.filterData(filedata,req.originurl);
						
		code = util.write200(req,res,filedata); //先丢出来	
					
	}else{
		code = util.write404(req,res);
	}
	return code;
}

module.exports = dir;