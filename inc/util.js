var path = require('path'),
	fs = require('fs'),
	url = require('url'),
	mime = require('./mime').mime,
	filters = require('./filters').filters,
	config = require('./config').configs;

	
function inLibPath(url){
	return config.full_libpath.some(function(e){
		return url.indexOf(e+'/') == 0
	});
}



function fileNotModified(req,res,position){
	var ifModifiedSince = "If-Modified-Since".toLowerCase();
	var lastModified = fs.statSync(position).mtime.toUTCString();
	var modifiedSince = req.headers[ifModifiedSince];
	res.setHeader("Last-Modified", lastModified);
	return modifiedSince && lastModified == modifiedSince;
}

function isFile(position){
	return path.existsSync(position) && !fs.statSync(position).isDirectory();
}

function hasDirectoryWithName(position){
	return path.existsSync(position.split('.')[0]);
}

function getLibPath(url){
	return config.full_libpath.filter(function(e){
		return url.indexOf(e) == 0;
	})[0]; 
}

function getConcatFromLibPath(libpath,url){
	var json,concats,concat;
	if(path.existsSync(config.origin + libpath + '/build.json')){	
		json = fs.readFileSync(config.origin + libpath + '/build.json','binary');
		concats = JSON.parse(json).concat;
	}else{
		concats = [];
	}
	
	//找到要打包的那一个
	concat = concats.filter(function(e){
		return e.output == path.basename(url)
	})[0];
	return concat;
}


function isJs(url){
	return path.extname(url)=='.js';
}

function addHeaders(req,res,body,type){
	var expires,
		pathname = url.parse(req.url).pathname,
		ext = path.extname(pathname).slice(1) || 'unknown',
		contentType = type || mime.getMimeType(ext);
		
	body = body || '';
	
	if (ext.match(config.expires.fileMatch)){
	    expires = new Date();
	    expires.setTime(expires.getTime() + config.expires.maxAge * 1000);
	    res.setHeader("Expires",expires.toUTCString());
	    res.setHeader("Cache-Control","max-age=" + config.expires.maxAge);
	}
	res.setHeader("Content-Type",contentType);
	res.setHeader("Content-Length",Buffer.byteLength(body,'binary'));
    res.setHeader("Server","NodeJs("+process.version+")");
    console.log(contentType);
}

function write304(req,res){
	addHeaders(req,res);
    res.writeHead(304,"Not Modified");
    res.end();
    return 304;
}

function write404(req,res){
    var body= 'can\'t found "' + req.url + '"';
    addHeaders(req,res,body,'text/plain');
    res.writeHead(404,"Not Found");
    res.write(body,"binary");
    res.end();
    return 404;
}

function write200(req,res,body){
	addHeaders(req,res,body);
	res.writeHead(200,"OK");	
	res.write(body,"binary");
	res.end();
	return 200;
}



// filter data with custom filters
function filterData(data,url){	
	config.filters.forEach(function(filter){
		data = filters[filter](data,url);
	});

	return data;	

}


// 合并文件
function concatFiles(arr,fn){
	var sum = '';
	var dataTemp;
	arr.forEach(function(path){
		dataTemp = fs.readFileSync(path,'binary');
		if(fn){
			dataTemp = fn(dataTemp,path);
		}
		sum += dataTemp + '\n';
	});
	return sum;
}

exports.fileNotModified = fileNotModified;
exports.getLibPath = getLibPath;
exports.hasDirectoryWithName = hasDirectoryWithName;
exports.isFile = isFile;
exports.getConcatFromLibPath = getConcatFromLibPath;
exports.inLibPath = inLibPath;
exports.isJs = isJs;
exports.write404 = write404;
exports.write304 = write304;
exports.write200 = write200;
exports.filterData = filterData;
exports.concatFiles = concatFiles;
