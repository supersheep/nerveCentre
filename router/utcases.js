var util = require('../inc/util'),
	linkTree = require('../inc/linktree'),
	fs = require('fs'),
	base = require('../config').base,
	config = require('../config').configs;
function utcases(req,res){

	var linktree = linkTree(config.origin + "/test/unit",".html",[".js",".html"],['ajax']);
	var flatterned = [];
	
		
	function flattern(tree,arr,ignore){
		var ret = arr || [];
		
		if(ignore.indexOf(tree.name)===-1){
			ret.push({
				name:tree.name,
				link:"http://" + req.headers.host  + tree.link
			});
		}
		
		if(tree.children){
			tree.children.forEach(function(child){
				flattern(child,ret,ignore);
			});
		}
		
		return ret;	
	}
	

	
	
	flattern(linktree,flatterned,['unit','form']);
	content = JSON.stringify(flatterned);
	ret = util.write200(req,res,content);


}


module.exports = utcases;
