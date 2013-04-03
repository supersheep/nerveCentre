var path = require('path'),
	fs = require('fs'),
	url = require('url'),
	moment = require('moment'),
	mime = require('./mime'),
	util = require('util');
 
function log(req,res,code){
	console.log("%s GET %s - %s router:%s",moment().format(),req.pathname,code,req.router_name);
}

exports.fileNotModified = function (req,res,position){
	var ifModifiedSince = "If-Modified-Since".toLowerCase();
	var lastModified = fs.statSync(position).mtime.toUTCString();
	var modifiedSince = req.headers[ifModifiedSince];
	res.setHeader("Last-Modified", lastModified);
	return modifiedSince && lastModified == modifiedSince;
}

var addHeaders = exports.addHeaders = function (req, res,body){
	var expires,
		contentLength,
		config = req.config,
		pathname = url.parse(req.url).pathname,
		ext = path.extname(pathname).slice(1) || 'unknown',
		contentType = mime.getMimeType(ext);
		
	body = body || '';
	
	contentLength = body.constructor == Buffer ? body.length : Buffer.byteLength(body,'binary');
	
	if (ext.match(config.expires.fileMatch)){
	    expires = new Date();
	    expires.setTime(expires.getTime() + config.expires.maxAge * 1000);
	    res.setHeader("Expires",expires.toUTCString());
	    res.setHeader("Cache-Control","max-age=" + config.expires.maxAge);
	}
	res.setHeader("Content-Type",res.getHeader('Content-Type') || contentType);
	res.setHeader("Content-Length",contentLength);
	res.setHeader("Server","NodeJs("+process.version+")");
}

var

WRITER = {
	"200": function(req, res, body) {
	    if(body.constructor.name === "MuStream"){
			util.pump(body,res);

		}else{
			addHeaders(req,res,body);
			res.writeHead(200,"OK");
			res.write(body,"binary");
			res.end();
		}
	},

	"304": function (req,res){
		log(req,res,304);
		addHeaders(req,res);
	    res.writeHead(304,"Not Modified");
	    res.end();
	},

	"404": function (req,res){
		log(req,res,404);
	    var body= 'can\'t found "' + req.url + '"';
	    res.setHeader('Content-Type','text/html');
	    addHeaders(req,res,body);
	    res.writeHead(404,"Not Found");
	    res.write(body,"binary");
	    res.end();
	},

	"500": function(req, res, error){
		log(req,res,500);

		res.writeHead(500,"Server Side Error");
		res.write(error,"binary");
		res.end();
	}

}


exports.write = function(req, res, data) {
    var status = data.status;

    var writer = WRITER[status];

    if(writer){
    	writer(req, res, data.data);
    }else{
    	res.end();
    }
};
