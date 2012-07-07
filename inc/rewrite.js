var path = require('path');

var rules = [
	[/\.v\d+\.(png|jpg|gif|css|js|swf)/g,'.$1'], // remove version for all static files
	[/\.min.*\.(js|css)$/g,'.$1'] // remove min for js and css
	
];


var rewrite = function(req,rules){
	var rule,replace,reg,test;
	for( var i = 0,l = rules.length; i < l ; i++ ){
		rule = rules[i][0];
		
		
		replace = rules[i][1];
		reg = new RegExp(rule);
		req.originurl = req.originurl || req.url;
		
		test = reg.test(req.originurl);
		if(test){
			req.url = req.url.replace(rule,replace);
			//console.log('match:',i,req.originurl,req.url,replace);
		}else{		
			//console.log('fail:',i,rule,req.originurl,req.url);
		}
	}
}

exports.rules = rules;
exports.handle = rewrite;