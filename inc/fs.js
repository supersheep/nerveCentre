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

var list = exports.list = function(pos,ret,base){
	ret = ret || [];
	base = base || pos;
    var stats,info;
    
    if(!fs.existsSync(pos)){
	    return ret;
    }
    
    stats = fs.lstatSync(pos),
    info = {
        path: pos.split(base)[1],
        name: path.basename(pos,path.extname(pos))
    };

    if (stats.isDirectory()) {
        info.type = "folder";

        fs.readdirSync(pos).forEach(function(child) {
            list(pos + '/' + child,ret,base);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
    }

    ret.push(info);

	return ret;
}