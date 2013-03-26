var mod_path = require('path')
var	util = require("../inc/util")
var	fs = require('fs')
var	http = require("http")
var	mu = require("mu2")
var	require_engine = require('./require-engine')

exports.render = function(tplname, data, res){

	var 

	req = data.req, 
	config = req.config,

	template = require_engine.templateFile(config, tplname);

	console.log('template', template, tplname)

	if(!template){
		util.write500(req, res, {
			body: "template file not found: " + tplname
		});
	
	}else{
		mu.root = template.dir;

		data.site = req.config;

		var stream = mu.compileAndRender(template.file, data);

		mu.clearCache();
		
		util.write200(req, res, stream);
	}

	
}