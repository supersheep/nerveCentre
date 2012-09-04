var mod_path = require('path'),
	tpl = require("./tpl"),
	util = require("./util"),
	fs = require('fs');

exports.render = function(req,res,name){

	var config = req.config,
		tplname = name || req.router_name,
		tplfile;

	var	tpl_dir_project = mod_path.join(config.origin,config.tpl),
		tpl_dir_server = mod_path.join(config.base,"tpl");


	var filename = tplname + ".html",
		content,
		context;


	var tpl_file_project = mod_path.join(tpl_dir_project,filename),
		tpl_file_server = mod_path.join(tpl_dir_server,filename);


	if(fs.existsSync(tpl_dir_project)){
		content = fs.readFileSync(tpl_file_project);
		context = tpl_dir_project;
	}else{
		content = fs.readFileSync(tpl_file_server);
		context = tpl_dir_server;
	};

	var tplrender = tpl.parse(content.toString());

	var page = {};
	var site = req.config;

	var result = tplrender(page,site);

	util.write200(req,res,result);
}