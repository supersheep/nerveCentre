var fs = require('fs');

//比较文件夹
function watch(dirname,cb,interval){	
	var oldS = fs.readdirSync(dirname);;
	var diff;
	
	function arrdiff(arr1,arr2){				
		var l1 = arr1.length,l2 = arr2.length,l = l1<l2?l1:l2;
		var big = l1>=l2?arr1:arr2,small = l1<l2?arr1:arr2,res = [];
		var type = l2>l1?'add':l2<l1?'remove':'modify';
		
		big.sort();
		small.sort();
		
		for(var i = 0 ; i < l ; i ++ ){
			if(big.indexOf(small[i])==-1){
				res.push(small[i]);
			}else{
				big = big.filter(function(a){return a!=small[i]});				
			}
		}	
		
		return {change:res.concat(big),type:type};
	}
	
	setInterval(function(){
		var newS = fs.readdirSync(dirname);
		if(newS.join('|') != oldS.join('|')){
			cb(arrdiff(oldS,newS));			
			oldS = newS;
		}
	},interval);	
}

exports.watch = watch;