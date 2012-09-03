var ActionFactory = ncrequire("./action_factory");

var Build = ActionFactory.create("Build");


Build.prototype.run = function() {
	var opts = this.options,
		mods = this.mods;

	console.log(mods,opts);
};


Build.AVAILIABLE_OPTIONS = {
	env:{
		alias:["-e","--env"],
		description:"指定默认配置环境",
		length:1
	}
};

Build.MESSAGE = {
	USAGE:"usage: neuron build",
	DESCRIBE:"在指定的dir创建静态站点"
}


module.exports = Build;