#! /usr/bin/env node

var base = require('../config').base;
var server = require('../main');
var util = require('../inc/util');



var args = process.argv.slice(2);
var pwd = process.cwd();


var command = args[0];

switch(command){
	case "start":start();break;
	case "config":config();break;
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}


function start(){
	var origin,
		path = args[1],
		rest = path.slice(1);
		
	rest = rest.slice(1)==""?"":rest;
		
	if(path){
		if(path.indexOf("/") == 0){
			origin = path;
		}else if(path.indexOf("~") == 0){
			console.log("HME");
			origin = getUserHome() + rest;
		}else if(path.indexOf(".") == 0){
			console.log("DOT");
			origin = pwd  + rest;
		}else{
			origin = pwd + "/" + path;
		}
		
		server.start({
			origin:origin
		});
	}else{
		server.start();
	}
}

function config(){
	var action = args[1],
		key = args[2],
		value = args[3];
		
	if(!action){
		console.log("-neuron: neuron config <action>");
		return false;
	}
	
	if(action === "set"){
		console.log("neuron config set not prepared");
	}else if(action === "get"){
		console.log(server.getConfig(key));
	}
	process.exit();
}
