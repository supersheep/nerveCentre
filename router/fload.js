var fs = require('fs'),
	url = require('url'),
	path = require('path'),
	util = require('../inc/util'),	
	config = require('../config').configs;

function fload(req,res,type){
	var pathname = req.pathname,
		position = config.origin + pathname,
		dir = path.dirname(position)+"/",
		extname  = path.extname(position),
		fileName  = path.basename(position).slice(0,path.basename(position).indexOf(extname)),
		buildFileUrl = dir+config.build,
		code,
		filedata;
		
	
	switch(type){
		case "single":
			if(!util.isFile(position)){
				 util.write404(req,res);
			}else{
				if(util.fileNotModified(req,res,position)){
					code = util.write304(req,res);
				}else{
					filedata = fs.readFileSync(position,'binary');
					
					if(extname =='.js'){
						filedata = util.filterData(filedata,req.originurl);
					}
					
					code = util.write200(req,res,filedata);
				}
			}
			break;
			
			
		case "concat":
			//console.log( dir+ fileName);
			 toconcat = fs.readdirSync( dir+ fileName).filter(function(e){
				return e.indexOf(extname) > 0;
			}).map(function(e){
				return dir+ fileName + "/"+e;
			}); 
			//console.log(toconcat)
			if(toconcat.length == 0){
				code = util.write404(req,res);
			}else{
				filedata = util.concatFiles(toconcat);
				//console.log(filedata);
				//filedata = util.filterData(filedata,req.originurl);				
				code = util.write200(req,res,filedata); 
			}
			break;
		
		case "build":
			json = fs.readFileSync(buildFileUrl,'binary');
			concats = JSON.parse(json);
			//console.log(concats);
			try{
				for(var len = concats.length; len-- ; ){
					var data = concats[len];
					if(data.name == fileName && data.output == (fileName +extname)){
						//console.log(data.path);
						toconcat = data.path.map(function(e){
							return dir+ e;
						});
					}
					
					filedata = util.concatFiles(toconcat);
					code = util.write200(req,res,filedata); 
					break;
				}
			}catch(e){
				console.log(e);
			}
			
	
	}
	
	
	/* if(!util.isFile(position)){
		return util.write404(req,res);
	}
	
	function fromut(req){
		var referer = req.headers.referer;
		var ret = !!(referer && referer.match("/test/unit/"));
		return ret;
	}
	
	
	if(util.fileNotModified(req,res,position) && !fromut(req)){
		code = util.write304(req,res);
	}else{
		filedata = fs.readFileSync(position,'binary');
		
		if(path.extname(req.url)=='.js'){
			filedata = util.filterData(filedata,req.originurl);
		}
		
		code = util.write200(req,res,filedata);
	} */
	return code;
}

module.exports = fload;