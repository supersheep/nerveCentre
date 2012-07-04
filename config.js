
var config = {
	origin : '/Users/spud/Neuron',
	libbase: 'lib/',
	libpath : ['/lib','/s/j/app'],
	port : '3001',
	staticport : '3002',
	useproxy : false,
	expires : {
   		fileMatch: /^(gif|png|jpg|js|css)$/ig,
	    maxAge: 60*60*24*365
	},
	filters : [
		'strict',
		'uglify',
		'proxycomment',
		'buildtime',
		'branch'] // ['strict','uglify',...];
}

exports.configs = config;
exports.base = __dirname;
