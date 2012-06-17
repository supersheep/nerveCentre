var util = require('util'),
	fs = require('fs'),
	config = require('../config').configs;

function makelog(){
	var log;
	log = util.format.apply(null,arguments);
	return new Date() + ' ' + log;
}
	
exports.write = function(){	
	var log = makelog.apply(null,arguments);
	console.log(log);
	fs.open(config.logpath.common,'a+',function(err,fd){
		fs.write(fd,log + '\n',null,'utf-8',function(){
			fs.close(fd);
		});
	});
}

exports.error = function(){
	var log = makelog.apply(null,arguments);	
	console.log(log);
	fs.open(config.logpath.error,'a+',function(err,fd){
		fs.write(fd,log + '\n',null,'utf-8',function(){
			fs.close(fd);
		});
	});
}