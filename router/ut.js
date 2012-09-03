var fs = require('fs'),
	dirTree = require('../inc/dirtree'),
	exec = require('child_process').exec,
	url = require('url'),
	linkTree = require('../inc/linktree'),
	util = require('../inc/util'),	
	base = ncrequire('~/config/config').base,
	config = ncrequire('~/config/config').configs;

var jasmine = fs.readFileSync(base+'/tpl/jasmine.tpl');

function compileTestCase(origin,req){
	var debug = req.debug;
	var tpl = jasmine,
		args = {
			libbase:debug?config.libbase:config.utlibbase,
			server:config.server ? config.server : req.headers.host,
			env:req.env,
			title:"Unit Test " + req.pathname
		},
		pieces = {
			html:origin.toString().replace(/\$/g,"$$$$")
		};
	
	util.mix(args,pieces);
	
	return new Buffer(util.substitute(tpl,args));
}


function wrap_codes(path){
	var ret,
		data = readFileSync(path);
		
	if(path.indexOf(".js") > 0){
		ret = util.substitute('<script type="text/javascript">{js}</script>',{
			js:fs.readFileSync(jspos)
		});
	}
		
}

function _ut(req,res){
	var dirpath = req.pathname.replace(/\.html$/,''),
		htmlpath = dirpath + ".html",
		jspath = dirpath + ".js",
				
		htmlpos = config.origin + htmlpath,
		jspos = config.origin + jspath,
		dirpos = config.origin  + (dirpath==="/test/unit/all" ? "/test/unit" : dirpath),
		
		htmlexists = util.isFile(htmlpos),
		jsexists = util.isFile(jspos),
		direxists = util.isDir(dirpos),

		filesToConcat = null,
		compiled = null,
		code = null,
		
		pos = htmlexists ? htmlpos : ( jsexists ? jspos : null),
		args,content;
//		exec("jscoverage --encoding=utf-8 lib/ jscoverage_lib/");
		
		if(pos && util.fileNotModified(req,res,pos) && !req.debug){
			code = util.write304(req,res);
		}else{
			
			if(pos){
				// file exists
				if(htmlexists){
					content = fs.readFileSync(htmlpos);
				}else{
					content = util.substitute('<script type="text/javascript">{js}</script>',{
						js:fs.readFileSync(jspos)
					});
				}
				
				compiled = compileTestCase(content,req);
				
				code = util.write200(req,res,compiled);
			}else if(direxists){
				
				function getAllChildFilesToConcat(obj,arr){
					arr = arr || [];
					var _path = obj.path
					if(_path.indexOf('.js') > 0 || _path.indexOf(".html")>0){
						arr.push(_path);
					}
					
					if(obj.children){
						obj.children.forEach(function(child){
							getAllChildFilesToConcat(child,arr);	
						});
					}
					return arr;
				}
								
				filesToConcat = getAllChildFilesToConcat(
					dirTree(dirpos)
				);
			
				content = util.concatFiles(filesToConcat,function(data,path){
					
					if(path.indexOf(".js") > 0){
						data = util.substitute('<script type="text/javascript">{js}</script>',{
							js:data
						});
					}
					return data;
				},'utf8');
				compiled = compileTestCase(content,req);
				code = util.write200(req,res,compiled);
				
			}else{
				code = util.write404(req,res);
			}
		}
	
		return code;
}


function utcases(req,res){

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
		var ret = flattened || [],
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


function ut(req,res){
	var isConfig = /\/config$/;
	if(isConfig.test(req.pathname)){
		utcases(req,res);
	}else{
		_ut(req,res);
	}
}

module.exports = ut;
