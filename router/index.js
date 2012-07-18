var util = require('../inc/util'),
	linkTree = require('../inc/linktree'),
	fs = require('fs'),
	base = require('../config').base,
	config = require('../config').configs;

function renderTree(tree){
	
	var ret = "<ul>";
	
	
	tree.children.forEach(function(child,i){
		if(child.type == "folder"){
			ret += util.substitute('<li class="module">');
			ret += util.substitute('<h3 class="title" data-link="{link}">{name}</h3>',{
				name:child.name,
				link:child.link
			});
			
			if(child.children){
				ret += '<ul>';
				
				child.children.forEach(function(c,j){
					ret+=util.substitute('<li class="item" data-link="{link}">{name}</a></li>',{
						link:c.link,
						name:c.name
					});
				});
				
				ret += '</ul>';
			}			
		}
	});
	
	ret += "</ul>";
	return ret;
}


function index(req,res,env){


var pos = base+'/tpl/index.tpl',
	tpl,
	doctree,dochtml,
	uttree,uthtml,
	args,content,ret;



	tpl = fs.readFileSync(pos);
	
	
	// root,ext,filter,ignore,order
	doctree = linkTree(config.origin + "/docs/neuron",".md",[".md"],[],["intro","dom","lang","oop"]);
	dochtml = renderTree(doctree); 
	
	// root,ext,filter,ignore
	uttree = linkTree(config.origin + "/test/unit",".html",[".js",".html"],['ajax']);
	uthtml = renderTree(uttree);
	
	args = {
		env:env,
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