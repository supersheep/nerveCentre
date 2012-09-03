var util = require('../inc/util'),
	mod_path = require('path'),
 	fs = require('fs'),
	tpl = require('../inc/tpl');

function index(req,res){
	var config = req.config,
		tplfile;

	var	tpl_dir_project = mod_path.join(config.origin,config.tpl),
		tpl_dir_server = mod_path.join(config.base,"tpl");


	var filename = req.router_name+".html",
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

	res.end(result);
}


module.exports = index;
