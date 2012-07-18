var dirTree = require('./dirtree'),
	config = require('../config').configs;


function parseTree(tree,ext,filters,ignores,sort){
	
	ignores = ignores || [];
	
	tree.link = tree.path.split(config.origin)[1].split(".")[0] + ext;
	tree.name = tree.name.split(".")[0];

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