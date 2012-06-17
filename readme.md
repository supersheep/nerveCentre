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

STRUCT
========

-> Proxy
	-> ProxyRouter
	
-> Static
	-> Static
	-> Compiler (dir/config/origin)
	-> Filters (circlize)

-> Workers (circlize)

-> Main
	
		

TODO
====
0.0.2版
1.整理同步操作，改为异步
2.将配置独立于nervecentre之外
目标启动时间：6.14
目标完成日期：6.16