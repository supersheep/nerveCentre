var mod_path = require("path");

var base = global.BASE = mod_path.join(__dirname,"..");
global.require = function(mod){
	var modpath = null;
	if(mod.charAt(0) === "~"){
		modpath = mod_path.join(base, mod.slice(1));
	}else{
		modpath = mod;
	}
	
	return require(modpath);
}

