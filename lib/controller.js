
var mod_url = require('url');
var mod_path = require('path');
var rewriter = require('./rewriter');
var require_engine = require('./require-engine');
var toString = Object.prototype.toString;

function isArray(obj){
    return toString.call(obj) === '[object Array]';
}

function makeArray(arr){
    return isArray(arr) ? arr : arr === undefined ? [] : [arr];
};

function Controller(req, config){

	// url
	this.req = req;
	this.config = config;

	this._santitize_request();
	this._get_route();
};


Controller.prototype = {
	get_response: function() {
	    var data = this.get_module_data();
	    var action = this.get_action();

	    return action.render({
	    	route: this.route,
	    	data: data
	    });
	},

	get_action: function() {
	    return require_engine.action(this.config, this.route.action);
	},

	get_module_data: function() {
		var config = this.config;
		var req = this.req;

	    var data = {
	        req: req,
	        config: config
	    };

		makeArray(this.route.model).forEach(function(model_name) {
	        model = require_engine.model( config, model_name );

	        if ( model ) {
	            data[model_name] = model.getData(req, config);

	        } else {
	            console.log('model not found', model_name);
	        }
	    });

		return data;
	},

	_santitize_request: function(){
		var cfg = this.config;
		var req = this.req;

	    // santitize arguments
	    rewriter.handle(req, require_engine.rewriteRules(cfg));

	    req.queryObj = mod_url.parse(req.url, true).query;

	    // debug with query debug
	    req.debug = req.queryObj.debug !== undefined;

	    // assign pathname and position
	    req.pathname = decodeURI(mod_url.parse(req.url).pathname);

	    req.position = mod_path.join(cfg.origin,req.pathname); // 文件路径
	    req.extname = mod_path.extname(req.pathname); // 扩展名
	    req.filename = mod_path.basename(req.position,req.extname); // 文件名 不包含扩展名
	    req.dirpath = mod_path.dirname(req.position); // 文件夹路径
	    req.filepath = mod_path.join(req.dirpath,req.filename); //文件路径 不包含扩展名
	},

	_get_route: function() {
	    // routes
		var routes = require_engine.routes(this.config);

		var i = 0;
		var route;

		for(; route = routes[i]; i++){
			if(route.test.test(this.req.pathname)){
				break;
			}
		}
		
		this.route = route || routes.default_route;
	}

}

module.exports = Controller;


