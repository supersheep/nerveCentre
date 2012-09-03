var worker = ncrequire('./worker');

function endwith(str,sub){
	var last = str.lastIndexOf(sub),
		ret;
	if(last < 0 ){
		ret = false;
	}else{
		ret =  (last + sub.length) == str.length;
	}
	return ret;
}

var routes = [
	{
		test:function(url){
			var proxy_rules = worker.get("proxy_rules");
			
			for(var i in proxy_rules){
				if(endwith(url,i)){
					return true;
				}
			}
			return false;
		},
		ret:function(url){
			var proxy_rules = worker.get("proxy_rules");
			
			for(var i in proxy_rules){
				if(endwith(url,i)){
					return proxy_rules[i].indexOf('/') == 0 ? proxy_rules[i] : '/' + proxy_rules[i];
				}
			}
		}
	},
	{ // /lib/... to branch/neuron/lib/...
		test:/^\/lib\/(.+)/,
		ret:"/branch/neuron/lib/$1"
	},
	{ // branch/[xxx]/s/j/app/[yyy]/... to branch/[yyy]/s/sj/app/[yyy]/... 
		test:/^\/branch\/(\w+)\/s\/j\/app\/(\w+)\/(.+)/,
		ret:"/branch/$2/s/j/app/$2/$3"
	},
	{ // /branch/[xxx]/lib/... to branch/neuron/lib/...
		test:/^\/branch\/(\w+)\/lib\/(.+)/,
		ret:"/branch/neuron/lib/$2"
	}
];


exports.routes = routes;
