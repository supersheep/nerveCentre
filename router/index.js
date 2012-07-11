var util = require('../inc/util'),
	base = require('../config').base,
	fs = require('fs');

function index(req,res){
	var data = fs.readFileSync(base + '/index.html');
	res.setHeader("Content-Type","text/html");
	util.write200(req,res,data);
	return 200;	
}

module.exports = index;