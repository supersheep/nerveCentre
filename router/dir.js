var fs = ncrequire('fs'),
	url = ncrequire('url'),
	path = ncrequire('path'),
	util = ncrequire('../inc/util'),	
	config = ncncrequire('~/config/config').configs;

function dir(req,res){
	var pathname = req.pathname,
		dir,toconcat,code;
		
	dir = (config.origin + pathname).split('.js')[0];
	if(fs.existsSync(dir)){
			
		
		//找出文件夹下的js们			
		toconcat = fs.readdirSync( dir ).filter(function(e){
			return e.indexOf('.js') > 0;
		}).map(function(e){
			return dir + '/' + e;
		});
			
		filedata = "NR.define.on();\n";
		
		// 修改NR.define语句，以文件名定义模块
		filedata += util.concatFiles(toconcat,function(file,p){
			// /switch | /io
			var moduleBase = p.split(config.libbase)[0], // /Users/spud/Neuron/branch/neuron/
				moduleName = p.split(moduleBase)[1]; // /lib/1.0/switch/core.js
				
			return file.replace(/(KM|NR)\.define\(/,"NR.define('" + moduleName + "',") + "\n";
		});	
		
		filedata += "NR.define.off();";
		filedata = util.filterData(filedata,req.originurl);
						
		code = util.write200(req,res,filedata); //先丢出来	
					
	}else{
		code = util.write404(req,res);
	}
	return code;
}

module.exports = dir;