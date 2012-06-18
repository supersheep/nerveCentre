#! /usr/bin/env node

var server = require('../main');
var utl = require('../inc/util');


var args = process.argv.slice(2);
var pwd = process.cwd();

var command = args[0];

switch(command){
	case "start":start();break;
	case "test":test();break;
	case "config":config();break;
}


function start(){
	var origin;
	var path = args[1];
	if(path){
		if(path == '.'){
			origin = pwd;
		}else{
			origin = pwd + '/' + path;
		}
		server.start({
			origin:origin
		});
	}else{
		server.start();
	}
}

function test(){
	process.exit();
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
