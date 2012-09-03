var util = require('../inc/util'),	
	config = ncrequire('~/config/config').configs;

function cfg(req,res,libpath,concat){
	var toconcat,filedata,code;
	
	toconcat = concat.path.map(function(e){
		return config.origin + libpath + '/' + concat.folder +  '/' +  e
	});	
	filedata = util.concatFiles(toconcat);
	filedata = util.filterData(filedata,req.originurl);				
		
	code = util.write200(req,res,filedata); 
	return code;
}


module.exports = cfg;