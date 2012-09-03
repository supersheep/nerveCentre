var http = require('http'),
	fs = require('fs'),
	mod_url = require('url'),
	mod_path = require('path'),
	
	filters = require('./inc/filters').filters,
	rewrite = require('./inc/rewrite');


function createServer(cfg){
	// 检测是否有新增branch，刷新配置变量
	
	var server = http.createServer(function(req,res){	
		
		var pathname,
			position;
		
		rewrite.handle(req,rewrite.rules);	
	

		req.debug = url.parse(req.url,true).query.debug !== undefined;
		
		
		pathname = req.pathname = decodeURI(url.parse(req.url).pathname);
		position = config.origin + pathname; // 文件位置
		DOC = pathname.match(/\.md$/);
		ICON = pathname.match(/^\/favicon.ico$/);

		UNIT_TEST = pathname.match(/^\/(trunk\/|branch\/\w+\/|)test\/unit/);
		INDEX = pathname.match(/^\/$/);
		loadFileType = util.getLoadType(position);

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
		
		
		else{
			CODE = util.write404(req,res);
			VIA = "unmatch";
		}
		
	});
	return server;
}

exports.createServer = createServer;
