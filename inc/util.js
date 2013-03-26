var path = require('path'),
	fs = require('fs'),
	url = require('url'),
	moment = require('moment'),
	mime = require('./mime'),
	util = require('util'),
	filters = require('./filters');
 
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

var addHeaders = exports.addHeaders = function (req,res,body){
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


exports.write200 = function (req,res,body){
	log(req,res,200);

	if(body.constructor.name === "MuStream"){
		util.pump(body,res);
	}else{
		addHeaders(req,res,body);
		res.writeHead(200,"OK");
		res.write(body,"binary");
		res.end();
	}
}


exports.write304 = function (req,res){
	log(req,res,304);
	addHeaders(req,res);
    res.writeHead(304,"Not Modified");
    res.end();
}


exports.write404 = function (req,res){
	log(req,res,404);
    var body= 'can\'t found "' + req.url + '"';
    res.setHeader('Content-Type','text/html');
    addHeaders(req,res,body);
    res.writeHead(404,"Not Found");
    res.write(body,"binary");
    res.end();
}

exports.write500 = function(req, res, error){
	log(req,res,500);

	res.writeHead(500,"Server Side Error");
	res.write(error,"binary");
	res.end();
}

// filter data with custom filters
exports.filterData = function (req,data){	
	var filter_arr = req.config.filters || [],
		url = req.originurl;

	filter_arr.forEach(function(filter){
		if(filters[filter]){
			data = filters[filter](data,url,req);
		}
	});
	
	return data;	

}

// 合并文件
exports.concatFiles = function(arr,fn,encode){
	var sum = '';
	var dataTemp;
	arr.forEach(function(path){
		try{
		dataTemp = fs.readFileSync(path,encode||'binary');
		if(fn){
			dataTemp = fn(dataTemp,path);
		}
		sum += dataTemp + '\n';
		}catch(e){
		}
	});
	return sum;
}
