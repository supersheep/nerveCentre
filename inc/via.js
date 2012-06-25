var fs = require('fs'),
	path = require('path'),
	url = require('url'),
	config = require('../config').configs,
	util = require('./util'),
	
	qunit = require('./qunit-adapter'),
	jasmine = require('./jasmine-adapter');

	
function origin(req,res){
	var pathname = url.parse(req.url).pathname,
		position = config.origin + pathname,
		code,
		filedata;
	
	if(util.fileNotModified(req,res,position)){
		code = util.write304(req,res);
	}else{
		filedata = fs.readFileSync(position,'binary');
		
		if(path.extname(url)=='.js'){
			filedata = util.filterData(filedata,req.originurl);
		}
		
		code = util.write200(req,res,filedata);
	}
	return code;
}

function dir(req,res){
	var pathname = url.parse(req.url).pathname,
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


function cfg(req,res,libpath,concat){
	var toconcat,filedata,code;
	
	toconcat = concat.path.map(function(e){
		return config.origin + libpath + '/' + concat.folder +  '/' +  e
	});	
	filedata = util.concatFiles(toconcat);
	filedata = util.filterData(filedata,req.originurl);				
		
	code = util.write200(req,res,filedata); 
	return code;
}

function testCompile(origin,adapter,args){
	var content = util.substitute(adapter.before + origin + adapter.after,args);
	
	return content;
}

function test(req,res,env){
	var pathname = url.parse(req.url).pathname.replace(/\.html$/,'.js'),
		position = config.origin + pathname,
		content = fs.readFileSync(position),
		args = {
			libbase:config.libbase,
			server:config.server ? config.server : ('localhost:' + config.port),
			env:env,
			title:"Unit Test " + pathname
		};
	
	code = util.write200(req,res,testCompile(content,jasmine,args));
	return code;
}

exports.test = test;
exports.origin = origin;
exports.dir = dir;
exports.config = cfg;
