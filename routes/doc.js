var fsutil = require('../inc/fs'),
	util = require('../inc/util'),
	view = require('../inc/view'),
	mod_path = require('path'),
	fs = require('fs'),
	md = require('node-markdown').Markdown;

module.exports = function(req,res){
	var pos = req.position.replace(".html",".md");

	if(fsutil.isFile(pos)){
		view.render(req,res,"doc",{
			content:md(fs.readFileSync(pos,'utf8'))
		});
	}else{
		util.write404(req,res);
	}
}