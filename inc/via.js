var fs = require('fs'),
	path = require('path'),
	url = require('url'),
	config = require('../config').configs,
	base = require('../config').base,
	util = require('./util'),
	qunit = fs.readFileSync(base+'/inc/qunit.tpl'),
	jasmine = fs.readFileSync(base+'/inc/jasmine.tpl');

	
function origin(req,res){
	var pathname = url.parse(req.url).pathname,
		position = config.origin + pathname,
		code,
		filedata;
	
	if(util.fileNotModified(req,res,position)){
		code = util.write304(req,res);
	}else{
		filedata = fs.readFileSync(position,'binary');
		
		if(path.extname(req.url)=='.js'){
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


function compileTestCase(origin,tpl,args){

	var pieces = {
		html:origin
	};
	
	util.mix(args,pieces);
	
	return util.substitute(tpl,args);
}

function ut(req,res,env){
	var htmlpath = url.parse(req.url).pathname,
		jspath = htmlpath.replace(/\.html$/,'.js'),
		htmlpos = config.origin + htmlpath,
		jspos = config.origin + jspath,
		args,content;
			
		if(util.isFile(htmlpos)){
			content = fs.readFileSync(htmlpos);
		}else{
			content = util.substitute('<script type="text/javascript">{js}</script>',{
				js:fs.readFileSync(jspos)
			});
		}
		
		
		args = {
			libbase:config.libbase,
			server:config.server ? config.server : req.headers.host,
			env:env,
			title:"Unit Test " + htmlpath
		};
	
	compiled = compileTestCase(content,jasmine,args);
	compiled = new Buffer(compiled,'utf8');
	
	code = util.write200(req,res,compiled);
	return code;
}

exports.ut = ut;
exports.origin = origin;
exports.dir = dir;
exports.config = cfg;
