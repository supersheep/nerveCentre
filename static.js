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
			ENV,
			RESOURCE,
			CONFIG_CONCAT;
		
		rewrite.handle(req,rewrite.rules);	
		
		pathname = req.pathname = decodeURI(url.parse(req.url).pathname);
		position = config.origin + pathname; // 文件位置
		
		
		DOC = req.url.match(/\.md$/);
		ICON = req.url.match(/^\/favicon.ico$/);
		RESOURCE = req.url.match(/^\/nc_res\//);
		UNIT_TEST = req.url.match(/^\/(trunk\/|branch\/\w+\/|)test\/unit\/.*\.html$/);
		INDEX = req.url.match(/^\/$/);
		TESTJSON = req.url.match(/^\/testcases.json$/);
		
		
		FILE_EXIST = util.isFile(position);
		IS_JS = util.isJs(position);
		DIR_EXIST = util.hasDirectoryWithPath(position);
		IN_LIB_PATH = util.inLibPath(pathname);
		LIB_PATH = util.getLibPath(pathname);
		CONFIG_CONCAT = util.getConcatFromLibPath(LIB_PATH,req.url);
		
		ENV = config.env === "dev" ? "" : "/branch/neuron"; 
		
		
		if(ICON){
			return false;
		}else if(INDEX){
			CODE = via('index')(req,res,ENV);
			VIA = 'index';
		}else if(RESOURCE){
			CODE = via('res')(req,res);
			VIA = 'res';
		}else if(DOC){
			CODE = via('doc')(req,res);
			VIA = 'doc';
		}else if(TESTJSON){
			CODE = via('utcases')(req,res);
			VIA = "utcases";
		}else if(UNIT_TEST){
			CODE = via('ut')(req,res,ENV);
			VIA = 'ut';
		}else if( (IS_JS && !DIR_EXIST && !CONFIG_CONCAT) || (FILE_EXIST && !IS_JS)){
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
			VIA = "unmatch";
		}
		
		log.write("GET %s %s : %s",
					pathname,
					VIA && ('via ' + VIA),
					CODE);
		
		
		
	});
	return server;
}

exports.createServer = createServer;
