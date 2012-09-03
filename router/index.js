var util = require('../inc/util'),
	linkTree = require('../inc/linktree'),
	fs = require('fs'),
	base = require('../config/config').base,
	config = require('../config/config').configs;

function renderDocTree(tree,depth){
	var ret = "";
	
	depth = depth || 0;
	
	if(tree.children){
		ret += depth===0?"":util.substitute("<h3 class=\"title\" data-link=\"{link}\">{name}</h3>",{
			name:tree.name,
			link:tree.link
		});
		ret += "<ul>";
		
		ret += tree.children.map(function(child){
			return util.substitute("<li class=\"{type}\" data-link=\"{link}\" >" + renderDocTree(child,depth+1) + "</li>",{
				link:child.link,
				type:(child.children?"module":"item") + (depth==0?" root":"")
			});
		}).join("");
		ret += "</ul>";
	}else{
		ret = util.substitute('<a data-link="{link}">{name}</a>',{
			link:tree.link,
			name:tree.name
		});
	}
	
	
	return ret;
}

function renderTestTree(tree){
	var ret = "<ul>";
	
	
	tree.children && tree.children.forEach(function(child,i){
		if(child.type == "folder"){	
			ret += '<li class="module root">';
			ret += util.substitute('<h3 class="title" data-link="{link}">{name}<a class="jscov" href="{clib}jscoverage.html?{link}" target="_blank">c</a></h3>',{
				clib:config.utlibbase,
				name:child.name,
				link:child.link
			});
			
			if(child.children){
				ret += '<ul>';
				
				child.children.forEach(function(c,j){
					ret+=util.substitute('<li class="item" data-link="{link}">{name}<a href="{clib}jscoverage.html?{link}" target="_blank">c</a></li>',{
						clib:config.utlibbase,
						link:c.link,
						name:c.name
					});
				});
				
				ret += '</ul>';
			}	
			ret += "</li>";		
		}
	});
	
	ret += "</ul>";
	return ret;
}


function index(req,res){


var pos = base+'/tpl/index.tpl',
	tpl,
	doctree,dochtml,
	uttree,uthtml,
	args,content,ret;



	tpl = fs.readFileSync(pos);
	
	
	// root,ext,filter,ignore,order
	doctree = linkTree(config.origin + "/docs",".md",[".md"],[],["intro","dom","lang","oop"]);
	dochtml = renderDocTree(doctree); 
	
	// root,ext,filter,ignore
	uttree = linkTree(config.origin + "/test/unit",".html",[".js",".html"],['ajax']);
	uthtml = renderTestTree(uttree);
	
	args = {
		env:req.env,
		libbase:config.libbase,
		server:req.headers.host,
		title:"Neuron",
		tests: uthtml,
		docs:dochtml
	};
		
	content = util.substitute(tpl,args);
	content = new Buffer(content,'utf8');
	
	res.setHeader("Content-Type","text/html");
	ret = util.write200(req,res,content);


	return ret;	

}


module.exports = index;
