var fs = require('fs'),
    path = require('path')

function dirTree(filename) {
	
	
    var stats,info
    
    if(!fs.existsSync(filename)){
	    return {};
    }
    
    stats = fs.lstatSync(filename),
    info = {
        path: filename,
        name: path.basename(filename)
    };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
    }

    return info;
}

module.exports = dirTree;
