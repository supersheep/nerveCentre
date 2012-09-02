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
			loadFileType,
			VIA,
			ENV,
			RESOURCE,
			CONFIG_CONCAT;
		
		rewrite.handle(req,rewrite.rules);	
	

		req.debug = url.parse(req.url,true).query.debug !== undefined;
		
		
		pathname = req.pathname = decodeURI(url.parse(req.url).pathname);
		position = config.origin + pathname; // 文件位置
		DOC = pathname.match(/\.md$/);
		ICON = pathname.match(/^\/favicon.ico$/);
		//RESOURCE = pathname.match(/^\/nc_res\//);
		UNIT_TEST = pathname.match(/^\/(trunk\/|branch\/\w+\/|)test\/unit/);
		INDEX = pathname.match(/^\/$/);
		loadFileType = util.getLoadType(position);
		/* FILE_EXIST = util.isFile(position);
		IS_JS = util.isJs(position);
		IS_BULID = util.isBuild(position);
		DIR_EXIST = util.hasDirectoryWithPath(position);
		ENV = req.env = (config.env === "dev" ? "" : "branch/neuron/");  */
		
		if(ICON){
			return false;
		}else if(INDEX){  //首页页面模板加载
			CODE = via('index')(req,res);
			VIA = 'index';
		}else if(DOC){ //md文件加载
			CODE = via('doc')(req,res);
			VIA = 'doc';
		}else if(UNIT_TEST){//单元测试
			CODE = via('ut')(req,res);
			VIA = 'ut';
		}else if(loadFileType){
			CODE = via("fload")(req,res,loadFileType);
			VIA = 'fload';
		}
		
		
		/* else if(RESOURCE){  //neuroncenter中文件加载
			CODE = via('res')(req,res);
			console.log(pathname);
			VIA = 'res';
		} */
		/* else if( (IS_JS && !DIR_EXIST && !CONFIG_CONCAT) || (FILE_EXIST && !IS_JS)){//外部文件加载,非neuroncenter,非配置
			CODE = via('origin')(req,res);
			VIA = 'origin';
		}else if(CONFIG_CONCAT){  //外部bulid.json配置文件合并
			CODE = via('cfg')(req,res,LIB_PATH,CONFIG_CONCAT);
			VIA = 'cfg';
		}else if(!CONFIG_CONCAT && IS_JS){  //外部文件合并
			CODE = via('dir')(req,res);
			VIA = 'dir';
		} */
		
		else{
			CODE = util.write404(req,res);
			VIA = "unmatch";
		}

		
		
		 /* log.write("GET %s %s : %s",
					pathname,
					VIA && ('via ' + VIA),
					CODE);  */
		
		
		
	});
	return server;
}

exports.createServer = createServer;
