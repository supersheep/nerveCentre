var mod_path = require('path'),
	util = require("./util"),
	funcs = require("./funcs"),
	fs = require('fs'),
	http = require("http"),
	mu = require("mu2");

exports.render = function(req,res,name,page_data){

	var config = req.config,
		tplname = name || req.router_name,
		tplfile;

	var	tpl_dir_project = mod_path.join(config.origin,config.tpl),
		tpl_dir_server = mod_path.join(config.base,"tpl");


	var filename = tplname + ".html",
		dir;


	var tpl_file_project = mod_path.join(tpl_dir_project,filename),
		tpl_file_server = mod_path.join(tpl_dir_server,filename);


	if(fs.existsSync(tpl_dir_project)){
		dir = tpl_dir_project;
	}else{
		dir = tpl_dir_server;
	};

	mu.root = dir;

	var page = page_data;
	var site = req.config;

	var stream = mu.compileAndRender(filename,{page:page,site:site});

	mu.clearCache();
	
	util.write200(req,res,stream);
}