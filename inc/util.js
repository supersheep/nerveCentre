var path = require('path'),
	fs = require('fs'),
	url = require('url'),
	mime = require('./mime').mime,
	filters = require('./filters');
 

var fileNotModified = exports.fileNotModified = function (req,res,position){
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

var write304 = exports.write304 = function (req,res){
	addHeaders(req,res);
    res.writeHead(304,"Not Modified");
    res.end();
    return 304;
}

var write404 = exports.write404 = function (req,res){
    var body= 'can\'t found "' + req.url + '"';
    res.setHeader('Content-Type','text/plain');
    addHeaders(req,res,body);
    res.writeHead(404,"Not Found");
    res.write(body,"binary");
    res.end();
    return 404;
}

var write200 = exports.write200 = function (req,res,body){
	addHeaders(req,res,body);
	res.writeHead(200,"OK");
	res.write(body,"binary");
	res.end();
	return 200;
}



// filter data with custom filters
var filterData = exports.filterData = function (req,data){	
	var filter_arr = req.config.filters || [],
		url = req.originurl;

	filter_arr.forEach(function(filter){
		if(filters[filter]){
			data = filters[filter](data,url);
		}
	});
	
	return data;	

}

// 合并文件
var concatFiles = exports.concatFiles = function(arr,fn,encode){
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
