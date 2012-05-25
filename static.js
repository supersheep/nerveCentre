var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	path = require('path'),
	
	
	util = require('./inc/util'),
	log = require('./inc/log'),
	filters = require('./inc/filters').filters,
	config = require('./inc/config').configs,
	rewrite = require('./inc/rewrite'),
	via = require("./inc/via"),
	dirwatcher = require('./inc/dirwatcher');


// 初始化所有lib目录
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



var buildconcats = config.full_libpath.map(function(libpath){
	var buildpath = config.origin + libpath + '/build.json';
	if(path.existsSync(buildpath)){	
		var json = fs.readFileSync(buildpath,'binary');
		return JSON.parse(json).concat;
	}else{
		return [];
	}
});






// 检测是否有新增branch，刷新配置变量
dirwatcher.watch(config.origin + '/branch',function(a){
	var p = config.full_libpath;
	switch(a.type){		
		case 'add':config.libpath.forEach(function(e){
			p.push('/branch/' + a.change[0] + e)
		});break;
		case 'remove':p = p.filter(function(e){return !e.match('branch/'+a.change[0])});break;
		case 'modify':p = p.map(function(e){return e.replace('branch/'+a.change[1],'branch/'+a.change[0])});break;
	}
});

function createServer(cfg){
	cfg = cfg || config;
	var server = http.createServer(function(req,res){	
		
		var pathname,
			position,
			FILE_EXIST,
			IS_JS,
			DIR_EXIST,
			LIB_PATH,
			IN_LIB_PATH,
			CONFIG_CONCAT;
		
		rewrite.handle(req,rewrite.rules);	
		
		pathname = url.parse(req.url).pathname;
		position = config.origin + pathname;
		
		FILE_EXIST = util.isFile(position),
		IS_JS = util.isJs(position),
		DIR_EXIST = util.hasDirectoryWithName(position),
		LIB_PATH = util.getLibPath(pathname),
		IN_LIB_PATH = util.inLibPath(pathname),
		CONFIG_CONCAT = util.getConcatFromLibPath(LIB_PATH,req.url),
		ICON = req.url == "/favicon.ico",
		CODE = 200,
		VIA = 'origin';
		
		if(ICON){
			return false;
		}else if( (FILE_EXIST && IS_JS && !DIR_EXIST && !CONFIG_CONCAT) || (FILE_EXIST && !IS_JS)){
			CODE = via.origin(req,res);
			VIA = 'origin';
		}else if(!CONFIG_CONCAT && IS_JS){
			CODE = via.dir(req,res);
			VIA = 'dir';
		}else if(CONFIG_CONCAT){
			CODE = via.config(LIB_PATH,CONFIG_CONCAT,req,res);
			VIA = 'config';
		}else{
			CODE = util.write404(req,res);
			VIA = '';
		}
		
		log.write("%s GET %s %s : %s",
					new Date().toString(),
					pathname,
					VIA && ('via ' + VIA),
					CODE);
	});
	return server;
}

exports.createServer = createServer;
