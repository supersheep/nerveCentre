var Event = ncrequire('events').EventEmitter,
	fs = ncrequire('fs'),
	dirwatcher = ncrequire('./inc/dirwatcher'),
	config = ncrequire('./config').configs;

var cache = {};
// proxyRules
var workers = {
	"proxy_rules":function(){
		var rulesFile = __dirname + "/proxy_config.txt";
		var watch = fs.watch || fs.watchFile;
		watch(rulesFile,function(curr,prev){
			if(curr.mtime == prev.mtime){ // 无修改也会不断触发，原因尚不明
				worker.set("proxy_rules");
			}
		});
	},
	"lib_path":function(){
		var watcher = new dirwatcher.Watcher(config.origin + '/branch');
		watcher.on('change',function(dirs){
			worker.set("lib_path",dirs);
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
			
			list = data.split(process.platform == 'win32' ? '\r\n' : '\n');
			
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
	},
	"lib_path":function(dirs){
		var branches = [];
		var lib_path = [];
		
		if(dirs){
			branches = dirs.filter(function(dir){
				// 不带点，视为目录
				return dir.indexOf(".") < 0;
			}).map(function(dir){
				return '/branch/' + dir;
			});
			
		}
		
		// for dev tests
		branches.unshift('');
		branches.unshift('/trunk');
		
		branches.map(function(branch){
			return config.libpath.map(function(path){
				return branch + path;
			});
		}).forEach(function(branch_libs){
			lib_path = lib_path.concat(branch_libs);
		});
		
		cache["lib_path"] = lib_path;
	}
}

worker = {
	set:function(key,value){
		setters[key] && setters[key](value);
	},
	get:function get(key){
		return cache[key];
	},
	start:function(key){
		console.log("Worker " + key + " start ");
		if(workers[key]){
			workers[key]();
			this.set(key);
		}
	}
}


module.exports = worker;