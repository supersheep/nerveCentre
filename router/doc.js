var util = ncrequire('../inc/util'),
	config = ncncrequire('~/config/config').configs,
	base = ncncrequire('~/config/config').base,
	fs = ncrequire('fs'),
	url = ncrequire('url'),
	md = ncrequire('node-markdown').Markdown;

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
			
			res.setHeader('Content-Type','text/html');
			ret = util.write200(req,res,new Buffer(data));
		}
		
	}else{
		ret = util.write404(req,res);
	}
		
	
	return ret;	
}

module.exports = doc;