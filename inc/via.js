var fs = require('fs'),
	path = require('path'),
	url = require('url'),
	config = require('../config').configs,
	base = require('../config').base,
	util = require('./util'),
	qunit = fs.readFileSync(base+'/inc/qunit.tpl','utf8'),
	jasmine = fs.readFileSync(base+'/inc/jasmine.tpl','utf8');

	
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

function parseContent(content){
	var ret = {},
		nomatch = 0;
		
	['html','js','css'].forEach(function(type){
		var regstr = util.substitute('{{t}}((?:.|\\n)*){\\\/{t}}',{t:type}),
			REG = new RegExp(regstr);
			matches = content.match(REG);
		
		if(!matches){
			nomatch += 1;
			ret[type] = '';
		}else{
			ret[type] = matches[1];
		}
	});
	
	if(nomatch === 3){
		ret = {
			js:content,
			html:'',
			css:''
		}
	}
	
	return ret;
	
}

function compileTestCase(origin,tpl,args){

	var pieces = parseContent(origin);
	util.mix(args,pieces);
	
	return util.substitute(tpl,args);
}

function test(req,res,env){
	var pathname = url.parse(req.url).pathname.replace(/\.html$/,'.js'),
		position = config.origin + pathname,
		content = fs.readFileSync(position,'utf8'),
		args = {
			libbase:config.libbase,
			server:config.server ? config.server : ('localhost:' + config.port),
			env:env,
			title:"Unit Test " + pathname
		},
		compiled = compileTestCase(content,jasmine,args);
	
	code = util.write200(req,res,compiled);
	return code;
}

exports.test = test;
exports.origin = origin;
exports.dir = dir;
exports.config = cfg;
