var dirTree = require('./dirtree'),
	path = require('path'),
	config = require('../config/config');


function parseTree(tree,ext,filters,ignores,sort){
	
	ignores = ignores || [];
	
	tree.link = tree.path && tree.path.split(config.origin)[1];
	tree.link = plainName(tree.link) + ext;
	tree.name = plainName(tree.name);
	
	
	function plainName(name){
		var ext = path.extname(name);
		return ext ? name.split(ext)[0] : name;
	}
	
	if(tree.children){
	
		// 排序子项
		sort && tree.children.sort(function(a,b){
			return sort.indexOf(a.name) - sort.indexOf(b.name);	
		});
		
		// 过滤子项
		tree.children = tree.children.filter(function(item){
			return (item.type==="folder" && ignores.indexOf(item.name) === -1) || filters.some(function(e){
				return item.name.indexOf(e) >= 0;
			});
		});
		
		
		tree.children = tree.children.map(function(child,i){
			return parseTree(child,ext,filters,ignores);
		});
	}
	
	
	return tree;
}



	

function linktree(dir,ext,filter,sort){
	var doctree = dirTree(dir);
	
	return parseTree(doctree,ext,filter,sort);
}


module.exports = linktree;
