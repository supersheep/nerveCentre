<!DOCTYPE HTML>
<html lang="en-US">
<head>
<meta charset="UTF-8">
<title>{title}</title>
<script type="text/javascript">var __loaderConfig={appBase:"s/j/app/",libBase:"{libbase}",server:"{server}"};</script>
<script>
function $(){
    return 'blah';
};
    
</script>
<script src="http://{server}/{libbase}neuron-active.js"></script>
<script>NR.__loader.init();</script>
<script type="text/javascript" src="/tools/jasmine/jasmine.js"></script>
<script type="text/javascript" src="/tools/jasmine/jasmine-html.js"></script>
<script type="text/javascript" src="http://jstest.dianpingoa.com/js/inject.js"></script>

<link rel="stylesheet" href="/tools/jasmine/jasmine.css" />

<script>

/*
function describe(des, cb){
	var old_des = _des;

	_des += ' > ' + des;
	
	cb();
	
	_des = old_des;
};


function expect(result){

	return {
		toBeTruthy: function(){
			_expect(result, true);
		},
		
		toBeFalsy: function(){
			_expect(result, false);
		},
		
		toBeUndefined: function(){
			_expect(result, undefined);
		},
		
		toEqual: function(v){
			_expect(result, v);
		},
		
		toBe: function(v){
    		_expect(result, v);
		},
		
		not: {
    		toBeTruthy: function(){
    			_expect(result, true, true);
    		},
    		
    		toBeFalsy: function(){
    			_expect(result, false, true);
    		},
    		
    		toBeUndefined: function(){
    			_expect(result, undefined, true);
    		},
    		
    		toEqual: function(v){
    			_expect(result, v, true);
    		},
    		
    		toBe: function(v){
        		_expect(result, v, true);
    		}
		}
	}
};


function log(msg){
	var div = document.createElement('div');
	
	div.innerHTML = Array.prototype.slice.call(arguments).map(function(i){
		if(i === undefined){
			i = 'undefined';
		}else if(i === null){
			i = 'null';
		}else if(!i){
			i = 'false';
		}
		
		return '' + i;
	}).join(' ');
		
	document.body.appendChild(div);
};


function _expect(result, exp, not){
	des = _des;

	log(
		(not ? !(result === exp) : result === exp) ? 
			des + ' >> <span style="color:green">passed</span>' :
			des + ' >> <span style="color:red">failed</span>: expect ' + result + ' to be ' + exp
	);
};

function runs(fn){
	fn();
};

var _des = '', 
	it = describe,
	waitsFor = runs,
	body = document.getElementsByTagName('body')[0];
*/



</script>


</head>
<body>
    {html}
    <script type="text/javascript">(function(){var jasmineEnv=jasmine.getEnv();jasmineEnv.updateInterval=1000;var htmlReporter=new jasmine.HtmlReporter();jasmineEnv.addReporter(htmlReporter);jasmineEnv.specFilter=function(spec){return htmlReporter.specFilter(spec);};var currentWindowOnload=window.onload;window.onload=function(){if(currentWindowOnload){currentWindowOnload();}execJasmine();};function execJasmine(){jasmineEnv.execute();}})();</script>
</body>
</html>
