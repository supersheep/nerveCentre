var util = require('util'),
	fs = require('fs'),
	configs = require('../config'),
	config = configs.configs,
	appbase = configs.base;

function makelog(){
	var log;
	log = util.format.apply(null,arguments);
	return new Date() + ' ' + log;
}

function logto(path,log){
	
	path = path.indexOf('/') == 0 ? path : appbase + '/' + path;
	
	console.log(log);
	fs.open(path,'a+',function(err,fd){
		if(err){
			console.log(err);
		}else{
			fs.write(fd,log + '\n',null,'utf-8',function(){
				fs.close(fd);
			});
		}
	});
}

exports.write = function(){	
	var log = makelog.apply(null,arguments);
	logto(config.logpath.common,log);	
}

exports.error = function(){
	var log = makelog.apply(null,arguments);
	logto(config.logpath.error,log);
}