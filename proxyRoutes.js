var worker = require('./worker');

var routes = [
	{
		test:function(url){
			var proxy_rules = worker.get("proxy_rules");
			return proxy_rules && proxy_rules[url];
		},
		ret:function(url){
			var proxy_rules = worker.get("proxy_rules");
			return proxy_rules && proxy_rules[url];
		}
	},
	{
		test:/^\/lib\/(.+)/,
		ret:"/branch/neuron/lib/$1"
	},
	{
		test:/^\/branch\/(\w+)\/s\/j\/app\/(\w+)\/(.+)/,
		ret:"/branch/$2/s/j/app/$2/$3"
	},
	{
		test:/^\/branch\/(\w+)\/lib\/(.+)/,
		ret:"/branch/neuron/lib/$2"
	}
];


exports.routes = routes;
