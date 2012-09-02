var util = require("./util/util");

var merge = util.merge;
const DEV = process.argv.indexOf("-d") > 0



var common = {
	origin : '/your/doc/root',
	expires : {
   		fileMatch: /^(gif|png|jpg|js|css)$/ig,
	    maxAge: 60*60*24*365
	}
}

var product = {
	origin:'D:\\StaticFiles',
	port:'1337',
	env:"pro",
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
	origin:'/your/doc/root',
	port : '1337',
	env:"dev",
	staticport : '1339',
	useproxy : false,
	build:"build.json",
	libbase: 'lib/1.0/',
	libpath : ['/lib/1.0','/lib','/s/j/app'],
	filters : [
		'strict',
		'uglify',
		'proxycomment',
		'buildtime',
		'branch']
}


var current = DEV?develop:product;

console.log("ENV",DEV?"DEV":"PRODUCT");

exports.configs = merge(merge({},common),current,true);
exports.base = __dirname;
