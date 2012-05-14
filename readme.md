nerveCentre
======

the node server for node framework

1. configs

- origin : '/Users/spud/Neuron',
- libpath : ['/lib','/s/j/app'],
- port : '3001',
- staticport : '3002',
- useproxy : true,
- expires : {
	fileMatch: /^(gif|png|jpg|js|css)$/ig,
	maxAge: 60*60*24*365
}
- filters : [
	'strict', // add "use strict"
	'uglify', // use uglify for min.js
	'buildtime', // replace %buldtime%
	'branch']	// replace branch
}
