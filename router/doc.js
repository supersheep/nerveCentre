var util = require('../inc/util'),
	config = require('../config').configs,
	base = require('../config').base,
	fs = require('fs'),
	url = require('url'),
	md = require('node-markdown').Markdown;

var mdtpl = fs.readFileSync(base + '/tpl/markdown.tpl');

function doc(req,res){
	var path = req.pathname,
		pos = config.origin + path,
		data;
	
	if(util.isFile(pos)){
		
		if(util.fileNotModified(req,res,pos)){
			ret = util.write304(req,res);
		}else{
			data = String(fs.readFileSync(pos));
		
			data = md(data);
			
			/* if(req.headers["x-requested-with"] !== "XMLHttpRequest"){
				data = util.substitute(mdtpl,{
					data:data
				});
			} */
			
			res.setHeader('Content-Type','text/html');
			ret = util.write200(req,res,new Buffer(data));
		}
		
	}else{
		ret = util.write404(req,res);
	}
		
	
	return ret;	
}

module.exports = doc;