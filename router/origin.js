var fs = require('fs'),
	url = require('url'),
	path = require('path'),
	util = require('../inc/util'),	
	config = require('../config').configs;

function origin(req,res){
	var pathname = url.parse(req.url).pathname,
		position = config.origin + pathname,
		code,
		filedata;
	
	if(util.fileNotModified(req,res,position)){
		code = util.write304(req,res);
	}else{
		filedata = fs.readFileSync(position,'binary');
		
		if(path.extname(req.url)=='.js'){
			filedata = util.filterData(filedata,req.originurl);
		}
		
		code = util.write200(req,res,filedata);
	}
	return code;
}

module.exports = origin;