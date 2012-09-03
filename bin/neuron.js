#! /usr/bin/env node

var base = ncncrequire('~/config/config').base;
var server = ncrequire('../main');
var util = ncrequire('../inc/util');



var args = process.argv.slice(2);
var pwd = process.cwd();


var command = args[0];


process.on('uncaughtException',function(e){
	console.log("Error:",e);
});

switch(command){
	case "start":start();break;
	case "config":config();break;
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function getFullPath(path){

	var origin,
		rest = path.slice(1);
		
	rest = rest.slice(1)==""?"":rest;
	
	if(path.indexOf("/") == 0){
		origin = path;
	}else if(path.indexOf("~") == 0){
		origin = getUserHome() + rest;
	}else if(path.indexOf(".") == 0){
		origin = pwd  + rest;
	}else{
		origin = pwd + "/" + path;
	}
		
	return origin;
}

function start(){
	var origin,
		path = args[1] || "",
		port = args[2],
		staticport;
		
	if(port = parseInt(port)){
		staticport = port+1;
	}else{
		port = null;
		staticport = null;
	}
		
	if(path){	
		origin = getFullPath(path);		
		
		server.start({
			origin:origin,
			port:port,
			staticport:staticport
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
