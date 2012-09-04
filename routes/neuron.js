var fs = require('fs'),
	url = require('url'),
	mod_path = require('path'),
	fsutil = require('../inc/fs'),
	util = require('../inc/util'),	
	config = require('../config/config');


function neuron_static(req,res){
	var config = req.config,
		pathname = req.pathname, // /a/b/c.js
		position = req.position, // /home/spud/a/b/c.js
		libpath = config.libpath, // support multi libpath later
		dirpath = mod_path.dirname(position), // /home/spud/a/b
		extname  = mod_path.extname(position); // .js

	function try_from_build(){
		var build_file_path = mod_path.join(dirpath,"build.json"),
			basename = mod_path.basename(position);

		if(!fs.existsSync(build_file_path)){
			return false;
		}

		try{
			var concats = JSON.parse(fs.readFileSync(build_file_path)).concat;
		}catch(e){
			return false;
		}

		var concat = concats.filter(function(data){
			return data.output === basename;
		})[0];

		if(!concat){
			return false;
		}

		console.log(libpath);
		var toconcat = concat.path.map(function(subpath){
			return mod_path.join(config.origin,libpath,concat.folder,subpath);
		});

		console.log(toconcat);
		filedata = util.concatFiles(toconcat);
		filedata = util.filterData(req,filedata);

		util.write200(req,res,filedata);
		return true;
	}

	function try_from_dir(){
		var toconcat,
			filedata,

			basename  = mod_path.basename(position,extname), // c
			path_with_same_name = mod_path.join(dirpath,basename); // /home/spud/a/b/c
		
		if(!fsutil.isDir(path_with_same_name)){
			return false;
		}

		if(!pathname.match(libpath)){
			return false;
		}

		toconcat = fs.readdirSync(path_with_same_name).filter(function(e){
			return mod_path.extname(e) === extname;
		}).map(function(e){
			return mod_path.join(dirpath,basename,e);
		});


		filedata = "NR.define.on();\n";
		filedata += util.concatFiles(toconcat,function(file,p){
			var moduleBase = p.split(config.libpath)[0], // /Users/spud/Neuron/branch/neuron/
				moduleName = p.split(moduleBase)[1]; // /lib/1.0/switch/core.js
				
			return file.replace(/(KM|NR)\.define\(/,"NR.define('" + moduleName + "',") + "\n";
		});
		filedata += "NR.define.off();";

		util.write200(req,res,filedata);
		return true;
	}

	function try_from_static(){

		if(!fsutil.isFile(position)){
			util.write404(req,res);
			return;
		}

		if(util.fileNotModified(req,res,position)){
			util.write304(req,res);
			return;
		}

		var filedata = fs.readFileSync(position,'binary');

		if(fsutil.isJs(position)){
			filedata = util.filterData(req,filedata);
		}
		
		util.write200(req,res,filedata);
	}

	if(try_from_build())return;

	if(try_from_dir())return;

	try_from_static();
}

module.exports = neuron_static;