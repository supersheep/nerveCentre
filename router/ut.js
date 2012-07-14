var fs = require('fs'),
	url = require('url'),
	util = require('../inc/util'),	
	base = require('../config').base,
	config = require('../config').configs;

var jasmine = fs.readFileSync(base+'/tpl/jasmine.tpl');

function compileTestCase(origin,tpl,args){

	var pieces = {
		html:origin
	};
	
	util.mix(args,pieces);
	
	return util.substitute(tpl,args);
}


function ut(req,res,env){
	var htmlpath = url.parse(req.url).pathname,
		jspath = htmlpath.replace(/\.html$/,'.js'),
		htmlpos = config.origin + htmlpath,
		jspos = config.origin + jspath,
		htmlexists = util.isFile(htmlpos),
		jsexists = util.isFile(jspos),
		pos = htmlexists ? htmlpos : ( jsexists ? jspos : null),
		args,content;
		
		
		if(pos && util.fileNotModified(req,res,pos)){
			code = util.write304(req,res);
		}else{
			if(pos){
				if(htmlexists){
					content = fs.readFileSync(htmlpos);
				}else{
					content = util.substitute('<script type="text/javascript">{js}</script>',{
						js:fs.readFileSync(jspos)
					});
				}
		
				args = {
					libbase:config.libbase,
					server:config.server ? config.server : req.headers.host,
					env:env,
					title:"Unit Test " + htmlpath
				};
			
				compiled = compileTestCase(content,jasmine,args);
				compiled = new Buffer(compiled,'utf8');
				
				code = util.write200(req,res,compiled);
			}else{
				code = util.write404(req,res);
			}
		}
	
		return code;
}

module.exports = ut;