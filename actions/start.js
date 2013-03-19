var mod_path = require("path"),
	fs = require("fs"),
	config = require("../config/config"),
	ActionFactory = require("../actions/action_factory"),
	merge = require("../inc/funcs").merge,
	staticServer = require("../static");

var Start = ActionFactory.create("Start");

Start.prototype.run = function() {
	var opts = this.options,
		mods = this.modules;
	
	var env = opts.env || "develop";

	var cliconfig = getCliConfig(opts, mods);
	var pjconfig = getProjectConfig(cliconfig);

	var final_config = merge(config, merge(pjconfig, cliconfig, true), true);
	
	staticServer.start(final_config);

};

function getCliConfig(config, mods){
	var pwd = process.cwd(),
		dir = mods[0],
		ret = {};

	ret.origin = mod_path.join(pwd, dir || '.');
	ret.port = config.port || 1337

	return ret;
}


function getProjectConfig (cfg){
	var pjconfig = {};
	var config_path = mod_path.join(cfg.origin, ".nc", "config.json");
	
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
	env: {
		alias:["-e","--env"],
		description:"指定默认配置环境",
		length: 1
	},

	port: {
		alias: [ "-p", "--port" ],
		description: "端口",
		length: 1
	}
};

Start.MESSAGE = {
	USAGE:"usage: neuron start [dir] [options]",
	DESCRIBE:"在指定的dir与端口启动服务"
}


module.exports = Start;
