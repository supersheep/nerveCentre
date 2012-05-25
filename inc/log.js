var util = require('util'),
	fs = require('fs'),
	config = require('./config').configs;
	
exports.write = function(){
	var log = util.format.apply(null,arguments);
	fs.open(config.logpath.common,'a+',function(err,fd){
		fs.write(fd,log + '\n');
	});
}