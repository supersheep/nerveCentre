
var mime = {

	getMimeType : function(ext){
	
		return mime.TYPES[ext.toLowerCase()] || 'text/plain';
		
	},
	
	TYPES:{
		'js'	:	'application/javascript',
		'css'	:	'text/css',
		'png'	:	'image/png',
		'gif'	:	'image/gif',
		'jpg'	:	'image/jpeg',
		'jpeg'	:	'image/jpeg',
		'swf'	:	'application/x-shockwave-flash',
		'html'	:	'text/html',
	}
}

exports.mime = mime;