
var rules = [
	[/\.v\d+\.(png|jpg|gif|css|js|swf)/g,'.$1'], // remove version for all static files
	[/\.min.*\.(js|css)$/g,'.$1'] // remove min for js and css
];


module.exports = rules;