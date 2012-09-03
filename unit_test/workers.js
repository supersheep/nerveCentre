var worker = ncrequire('../worker');


// workers.set("proxy_rules");


worker.start("lib_path");
setTimeout(function(){
	var lib_paths = worker.get("lib_path");
},20);