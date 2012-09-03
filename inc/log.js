var util = ncrequire('util'),
	fs = ncrequire('fs'),
	configs = ncncrequire('~/config/config'),
	config = configs.configs,
	appbase = configs.base;



function makelog(){
	var log;
	log = util.format.apply(null,arguments);
	util.log(log);
}


exports.write = function(){
	makelog.apply(null,arguments);
}

exports.error = function(){
	makelog.apply(null,arguments);
}