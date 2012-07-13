var util = require('../inc/util'),
	dirTree = require('../inc/dirtree'),
	fs = require('fs'),
	base = require('../config').base,
	config = require('../config').configs;

function pro(req,res){
	return util.write404(req,res);
}

function parseDoc(tree){
	var ret = "<ul>";
	
	tree.children.forEach(function(child,i){
		if(child.type == "folder"){
			ret += util.substitute('<li class="module{on}" style="height:{h}px" data-height="{h}" >',{
				on:(i==0?" on":""),
				h:33+(29*child.children.length)
			});
			ret += '<h3 class="title">' + child.name + '</h3>';
			
			if(child.children){
				ret += '<ul>';
				
				child.children.forEach(function(c,j){
					ret+=util.substitute('<li class="item"><a href="{link}">{name}</a></li>',{
						link:c.path.split(config.origin)[1],
						name:c.name.split(".md")[0]
					});
				});
				
				ret += '</ul>';
			}			
		}
	});
	
	ret += "</ul>";
	
	return ret;
}


function dev(req,res){

var tpl = fs.readFileSync(base+'/tpl/index.tpl');


var tree = dirTree(config.origin + "/docs/neuron");
var dochtml = parseDoc(tree);
var args = {
	libbase:config.libbase,
	server:config.server ? config.server : req.headers.host,
	title:"Neuron",
	docs:dochtml
};
	
var content = new Buffer(util.substitute(tpl,args),'utf8');

res.setHeader("Content-Type","text/html");
util.write200(req,res,content);
return 200;	
}

module.exports = (config.env=="dev")?dev:pro;