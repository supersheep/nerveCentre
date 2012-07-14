var util = require('../inc/util'),
	dirTree = require('../inc/dirtree'),
	fs = require('fs'),
	base = require('../config').base,
	config = require('../config').configs;

function pro(req,res){
	return util.write404(req,res);
}

function parseTree(tree,ext,filters,sort){
	var ret = "<ul>";
	
	// 排序
	sort && tree.children.sort(function(a,b){
		return sort.indexOf(a.name) - sort.indexOf(b.name);	
	});
	
	
	tree.children.forEach(function(child,i){
		
		if(child.children){
			// 过滤不符合后缀的文件
			child.children = child.children.filter(function(item){
				return filters.some(function(e){
					return item.name.indexOf(e) >= 0
				});
			});
		}
	
		if(child.type == "folder"){
			ret += util.substitute('<li class="module">');
			ret += util.substitute('<h3 class="title" data-link="{link}">' + child.name + '</h3>',{
				link:child.path.split(config.origin)[1] + ext
			});
			
			if(child.children){
				ret += '<ul>';
				
				child.children.forEach(function(c,j){
					ret+=util.substitute('<li class="item" data-link="{link}">{name}</a></li>',{
						link:c.path.split(config.origin)[1].split(".")[0] + ext,
						name:c.name.split(".")[0]
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


var doctree = dirTree(config.origin + "/docs/neuron");
var dochtml = parseTree(doctree,".md",[".md"],["intro","dom","lang","oop"]);

var uttree = dirTree(config.origin + "/test/unit");
var uthtml = parseTree(uttree,".html",[".js",".html"]);
var args = {
	libbase:config.libbase,
	server:config.server ? config.server : req.headers.host,
	title:"Neuron",
	tests: uthtml,
	docs:dochtml
};
	
var content = new Buffer(util.substitute(tpl,args),'utf8');

res.setHeader("Content-Type","text/html");
util.write200(req,res,content);
return 200;	
}

module.exports = (config.env=="dev")?dev:pro;