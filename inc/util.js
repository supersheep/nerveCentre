var path = require('path'),
	fs = require('fs'),
	url = require('url'),
	log = require('./log'),
	worker = require('../worker'),
	mime = require('./mime').mime,
	filters = require('./filters').filters,
	config = require('../config').configs;

function substitute(str,obj){
	for(var i in obj){
		str = String(str).replace(new RegExp("{" + i + "}","g"),obj[i]);
	}
	return str;
}


function inLibPath(url){
	return worker.get("lib_path").some(function(e){
		// such as /Users/spud/Neuron/node
		return url.indexOf( e + '/') == 0;
	});
}

function getLibPath(url){
	return worker.get('lib_path').filter(function(e){
		return url.indexOf(e) == 0;
	})[0];
}

function fileNotModified(req,res,position){
	var ifModifiedSince = "If-Modified-Since".toLowerCase();
	var lastModified = fs.statSync(position).mtime.toUTCString();
	var modifiedSince = req.headers[ifModifiedSince];
	res.setHeader("Last-Modified", lastModified);
	return modifiedSince && lastModified == modifiedSince;
}

function isFile(pos){
	return fs.existsSync(pos) && !fs.statSync(pos).isDirectory();
}

function isDir(pos){
	return fs.existsSync(pos) && fs.statSync(pos).isDirectory();
}

function isJs(url){
	return path.extname(url)=='.js';
}

function hasDirectoryWithPath(position){
	var jsIndex = position.lastIndexOf(".js"),
		dirpath = position.slice(0,jsIndex);
		
	return isDir(dirpath);
}


function getConcatFromLibPath(libpath,url){
	var json,concats,concat;
	if(fs.existsSync(config.origin + libpath + '/build.json')){	
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



function addHeaders(req,res,body){
	var expires,
		contentLength,
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

function write304(req,res){
	addHeaders(req,res);
    res.writeHead(304,"Not Modified");
    res.end();
    return 304;
}

function write404(req,res){
    var body= 'can\'t found "' + req.url + '"';
    res.setHeader('Content-Type','text/plain');
    addHeaders(req,res,body);
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
		if(filters[filter]){
			data = filters[filter](data,url);
		}
	});
	return data;	

}


// 合并文件
function concatFiles(arr,fn,encode){
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
			log.error('concating files',e);
		}
	});
	return sum;
}

function mix(a,b){
	for(var i in b){
		a[i] = b[i]
	}
}

module.exports = {
	isJs:isJs,
	isDir:isDir,
	isFile:isFile,
	inLibPath:inLibPath,
	getLibPath:getLibPath,
	fileNotModified:fileNotModified,
	hasDirectoryWithPath:hasDirectoryWithPath,
	getConcatFromLibPath:getConcatFromLibPath,
	write200:write200,
	write304:write304,
	write404:write404,
	filterData:filterData,
	concatFiles:concatFiles,
	substitute:substitute,
	mix:mix
}
