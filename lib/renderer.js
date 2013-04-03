var mod_path = require('path')
var	util = require("../inc/util")
var	fs = require('fs')
var	http = require("http")
var	mu = require("mu2")
var	require_engine = require('./require-engine')

exports.render = function(tplname, data){

	var config = data.config;
	var template = require_engine.templateFile(config, tplname);

	if(!template){
		return {
			status: 500,
			data: "template file not found: " + tplname
		};
	
	}else{
		mu.root = template.dir;

		var stream = mu.compileAndRender(template.file, data);

		mu.clearCache();

		return {
			status: 200,
			data: stream
		};
	}
	
}