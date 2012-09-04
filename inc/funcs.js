

exports.mix = function(a,b){
	for(var i in b){
		a[i] = b[i]
	}
}
exports.merge = function (a,b,overwrite){
	for(var key in b){
		if(overwrite || !a[key]){
			a[key] = b[key];
		}
	}
	return a;
}

exports.substitute = function(tpl,obj){
	var ret = tpl;
	for(var key in obj){
		ret = ret.replace("{"+key+"}",obj[key]);
	}
	return ret;
}

/*
function substitute(str,obj){
	for(var i in obj){
		str = String(str).replace(new RegExp("{" + i + "}","g"),obj[i]);
	}
	return str;
}*/