var util = require('../inc/util'),
	mod_path = require('path'),
 	fs = require('fs'),
 	view = require('../inc/view'),
	tpl = require('../inc/tpl');

function index(req,res){
	
    res.setHeader('Content-Type','text/html');
	view.render(req,res);
}


module.exports = index;
