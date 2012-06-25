var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	path = require('path'),
	default_config = require('./config').configs,
	
	worker = require('./worker'),
	
	util = require('./inc/util'),
	log = require('./inc/log'),
	filters = require('./inc/filters').filters,
	rewrite = require('./inc/rewrite'),
	via = require("./inc/via");
	


// 初始化所有lib目录
/*
config.full_libpath = (function(lib){
	var branchdirs = fs.readdirSync(config.origin + '/branch');;
	var l = [];

	lib.forEach(function(e){
		l.push('/trunk' + e);
		branchdirs.forEach(function(dir){
			l.push('/branch/' + dir + e);
		});
	});
	return l;
})(config.libpath);
*/


/*
var buildconcats = config.full_libpath.map(function(libpath){
	var buildpath = config.origin + libpath + '/build.json';
	if(path.existsSync(buildpath)){	
		var json = fs.readFileSync(buildpath,'binary');
		
		return JSON.parse(json).concat;
	}else{
		return [];
	}
});
*/

/*
config.origin + '/branch',function(a){
	var p = config.full_libpath;
	switch(a.type){		
		case 'add':config.libpath.forEach(function(e){
			p.push('/branch/' + a.change[0] + e)
		});break;
		case 'remove':p = p.filter(function(e){return !e.match('branch/'+a.change[0])});break;
		case 'modify':p = p.map(function(e){return e.replace('branch/'+a.change[1],'branch/'+a.change[0])});break;
	}
});
*/



function createServer(cfg){
	// 检测是否有新增branch，刷新配置变量
	worker.start("lib_path");
	var config = cfg || default_config;
	var server = http.createServer(function(req,res){	
		
		var pathname,
			position,
			
			FILE_EXIST,
			IS_JS,
			DIR_EXIST,
			LIB_PATH,
			IN_LIB_PATH,
			CODE,
			VIA,
			CONFIG_CONCAT;
		
		rewrite.handle(req,rewrite.rules);	
		
		pathname = url.parse(req.url).pathname;
		position = config.origin + pathname; // 文件位置
		
		FILE_EXIST = util.isFile(position),
		IS_JS = util.isJs(position),
		
		TEST = util.isTest(pathname,position),
				
		DIR_EXIST = util.hasDirectoryWithPath(position);
		
		IN_LIB_PATH = util.inLibPath(pathname);
		
		LIB_PATH = util.getLibPath(pathname);
		
		CONFIG_CONCAT = util.getConcatFromLibPath(LIB_PATH,req.url);
		
		ICON = req.url == "/favicon.ico";
		CODE = 200;
		VIA = 'origin';
		
		
		if(ICON){
			return false;
		}else if( (FILE_EXIST && IS_JS && !DIR_EXIST && !CONFIG_CONCAT) || (FILE_EXIST && !IS_JS && !TEST)){
			CODE = via.origin(req,res);
			VIA = 'origin';
		}else if(CONFIG_CONCAT){	
			CODE = via.config(req,res,LIB_PATH,CONFIG_CONCAT);
			VIA = 'config';
		}else if(!CONFIG_CONCAT && IS_JS){
			CODE = via.dir(req,res);
			VIA = 'dir';
		}else if(TEST){
			CODE = via.test(req,res,TEST.env);
			VIA = 'test';
		}else{
			CODE = util.write404(req,res);
			VIA = '';
		}
		
		log.write("GET %s %s : %s",
					pathname,
					VIA && ('via ' + VIA),
					CODE);
		
		
		
	});
	return server;
}

exports.createServer = createServer;
