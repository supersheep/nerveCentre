
var config = {
	origin : '/Users/spud/Neuron',
	libpath : ['/lib/1.0','/lib','/s/j/app'],
	port : '3001',
	staticport : '3002',
	useproxy : true,
	logpath: {
		common:'log/common.log',
		error:'log/error.log'
	},
	expires : {
   		fileMatch: /^(gif|png|jpg|js|css)$/ig,
	    maxAge: 60*60*24*365
	},
	filters : [
		'strict',
		'uglify',
		'buildtime',
		'branch'] // ['strict','uglify',...];
}

exports.configs = config;
exports.base = __dirname;