var mod_path = require("path"),
	fs = require("fs"),
	config = require("../config/config"),
	ActionFactory = require("../actions/action_factory"),
	merge = require("../util/funcs").merge,
	staticServer = require("../static");

var Start = ActionFactory.create("Start");

Start.prototype.run = function() {
	var opts = this.options,
			mods = this.modules;
	
	var env = opts.env || "develop";

	var pjconfig = getProjectConfig();
	var cliconfig = getCliConfig(mods);

	var final_config = merge(config,merge(pjconfig,cliconfig,true),true);
	


};

function getCliConfig(mods){
	var pwd = process.cwd(),
		dir = mods[0],
		port = mods[1],
		ret = {};

	dir && ( ret.origin = mod_path.join(pwd,dir));
	port && ( ret.port = port);

	return ret;
}


function getProjectConfig (){
	var pwd = process.cwd();
	var pjconfig = {};
	var config_path = mod_path.join(pwd,"config.json");
	if(fs.existsSync(config_path)){
	  try{
			 pjconfig = JSON.parse(fs.readFileSync(config_path));
		}catch(e){
			console.log("error parsing",config_path);
		}
	}
	return pjconfig;
}


Start.AVAILIABLE_OPTIONS = {
	env:{
		alias:["-e","--env"],
		description:"指定默认配置环境",
		length:1
	}
};

Start.MESSAGE = {
	USAGE:"usage: neuron start [dir] [port] [-e develop|product]",
	DESCRIBE:"在指定的dir与端口启动服务"
}


module.exports = Start;
