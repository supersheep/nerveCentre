
const DEV = process.argv.indexOf("-d") > 0


function merge(a,b){
	for(var key in b){
		if(!a[key]){
			a[key] = b[key];
		}
	}
	return a;
}

var common = {
	origin : '/your/doc/root',
	expires : {
   		fileMatch: /^(gif|png|jpg|js|css)$/ig,
	    maxAge: 60*60*24*365
	}
}

var product = {
	port:'1337',
	staticport:'1339',
	libbase: 'lib/1.0/',
	libpath : ['/lib/1.0','/lib','/s/j/app'],
	useproxy:true,
	filters : [
		'strict',
		'uglify',
		'proxycomment',
		'buildtime',
		'branch']
}

var develop = {
	port : '1337',
	staticport : '1339',
	libbase: 'lib/',
	libpath : ['/lib','/s/j/app'],
	useproxy : false,
	filters : [
		'strict',
		'uglify',
		'buildtime',
		'branch']
}


var current = DEV?develop:product;

console.log("ENV",DEV?"DEV":"PRODUCT");

exports.configs = merge(merge({},common),current);
exports.base = __dirname;
