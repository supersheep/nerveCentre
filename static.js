var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	path = require('path'),
	base = require('./config').base,
	default_config = require('./config').configs,
	
	worker = require('./worker'),
	
	util = require('./inc/util'),
	log = require('./inc/log'),
	filters = require('./inc/filters').filters,
	rewrite = require('./inc/rewrite'),
	via = require("./inc/via");


function merge(a,b,overwrite){
	for(var key in b){
		if(overwrite || !a[key]){
			a[key] = b[key];
		}
	}
	return a;
}

function createServer(cfg){
	// 检测是否有新增branch，刷新配置变量
	worker.start("lib_path");
	var config = merge(merge({},default_config),cfg,true);
	var server = http.createServer(function(req,res){	
		
		var pathname,
			position,
			
			FILE_EXIST,
			INDEX,
			IS_JS,
			DIR_EXIST,
			LIB_PATH,
			IN_LIB_PATH,
			CODE,
			DOC,
			VIA,
			CONFIG_CONCAT;
		
		rewrite.handle(req,rewrite.rules);	
		
		pathname = url.parse(req.url).pathname;
		position = config.origin + pathname; // 文件位置
		
		DOC = req.url.match(/\.md$/);
		
		INDEX = config.showhome && req.url === "/";
		
		FILE_EXIST = util.isFile(position),
		IS_JS = util.isJs(position),
		
		UNIT_TEST = util.isUnitTest(pathname,position),
				
		DIR_EXIST = util.hasDirectoryWithPath(position);
		
		IN_LIB_PATH = util.inLibPath(pathname);
		
		LIB_PATH = util.getLibPath(pathname);
		
		CONFIG_CONCAT = util.getConcatFromLibPath(LIB_PATH,req.url);
		
		ICON = req.url == "/favicon.ico";
		CODE = 200;
		VIA = 'origin';
		
		if(ICON){
			return false;
		}else if(INDEX){
			CODE = via('index')(req,res);
			VIA = 'index';
		}else if(DOC){
			CODE = via('doc')(req,res);
			VIA = 'doc';
		}else if(UNIT_TEST){
			CODE = via('ut')(req,res,UNIT_TEST.env);
			VIA = 'ut';
		}else if( (FILE_EXIST && IS_JS && !DIR_EXIST && !CONFIG_CONCAT) || (FILE_EXIST && !IS_JS && !UNIT_TEST)){
			CODE = via('origin')(req,res);
			VIA = 'origin';
		}else if(CONFIG_CONCAT){
			CODE = via('cfg')(req,res,LIB_PATH,CONFIG_CONCAT);
			VIA = 'cfg';
		}else if(!CONFIG_CONCAT && IS_JS){
			CODE = via('dir')(req,res);
			VIA = 'dir';
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
