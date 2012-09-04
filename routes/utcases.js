var util = require('../inc/util'),
	linkTree = require('../inc/linktree'),
	fs = require('fs'),
	url = require('url');
	
function utcases(req,res){
	var config = req.config;

	var linktree = linkTree(config.origin + "/test/unit",".html",[".js",".html"],['ajax']);
	var flatterned;
	var type = url.parse(req.url,true).query.type || "concats";
	
	function concats(tree,ignore){
		var ret = [],
			ignore = ignore || [];
		
		tree.children.forEach(function(child){
			if(ignore.indexOf(child.name)===-1){
				ret.push({
					name:child.name,
					link:"http://" + req.headers.host  + child.link
				});
			}
		});		
		return ret;	
	}	
	
	
	function all(tree,ignore,flattened){
		var ret = flattened ||　[],
			ignore = ignore || [];
		
		if(ignore.indexOf(tree.name)===-1){
			if(!tree.children){
				ret.push({
					name:tree.name,
					link:"http://" + req.headers.host  + tree.link
				});
			}
		}
		
		if(tree.children){
			tree.children.forEach(function(child){
				all(child,ignore,ret);
			});
		}
		
		return ret;	
	}
	
	
	if(type == "all"){
		flatterned = all(linktree);
	}else if(type == "concats"){
		flatterned = concats(linktree,["SAMPLE"]);
	}
	
	
	content = JSON.stringify(flatterned);
	ret = util.write200(req,res,content);

	return ret;
}


module.exports = utcases;
