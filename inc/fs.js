var fs = require("fs"),
	path = require("path");


var isFile = exports.isFile = function(pos){
	return fs.existsSync(pos) && fs.statSync(pos).isFile();
}

var isDir = exports.isDir = function(pos){
	return fs.existsSync(pos) && fs.statSync(pos).isDirectory();
}

var isJs = exports.isJs = function(pos){
	return path.extname(pos)=='.js';
}