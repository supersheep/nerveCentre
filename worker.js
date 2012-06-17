var Event = require('events').EventEmitter,
	fs = require('fs'),
	config = require('./config').configs;

var cache = {};
// proxyRules
var workers = {
	"proxy_rules":function(){
		var rulesFile = __dirname + "/proxy_config.txt";
		fs.watchFile(rulesFile,function(curr,prev){
			if(curr.mtime == prev.mtime){ // 无修改也会不断触发，原因尚不明
				set("proxy_rules");
			}
		});
	}
}

var setters = {
	"proxy_rules":function(){
		var rulesFile = __dirname + "/proxy_config.txt";
		fs.readFile(rulesFile,'binary',function(err,data){
			var list,
				rules = {};
			if(err){
				throw new Error("can\'t read "+ rulesFile);
			}
			
			list = data.split('\n');
			
			list.forEach(function(e){
				var splited = e.split('|'),
					key = splited[0],
					value = splited[1];
				
				if(splited.length == 2){
					rules[key] = value;
				}
			});
			cache["proxy_rules"] = rules;
		});
	}
}

worker = {
	set:function(key){
		setters[key] && setters[key]();
	},
	get:function get(key){
		return cache[key];
	},
	start:function(key){
		if(workers[key]){
			workers[key]();
			this.set(key);
		}
	}
}

worker.prototype = Event;


module.exports = worker;