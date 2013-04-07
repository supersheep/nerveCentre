var

path = require('path'),

rewrite = function(req, rules){
	var rule,replace,reg,test;
	for( var i = 0,l = rules.length; i < l ; i++ ){
		rule = rules[i][0];
		
		
		replace = rules[i][1];
		reg = new RegExp(rule);
		req.originurl = req.originurl || req.url;
		
		test = reg.test(req.originurl);

		if(test){
			req.url = req.url.replace(rule, replace);
		}
	}
}

exports.handle = rewrite;