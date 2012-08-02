<!DOCTYPE HTML>
<html lang="en-US">
<head>

<meta charset="UTF-8">
<title>Neuron</title>
<script type="text/javascript">var __loaderConfig={appBase:"s/j/app/",libBase:"{libbase}",server:"{server}"};</script>
<script src="http://{server}/{env}{libbase}neuron-active.js"></script>
<script>NR.__loader.init();</script>
<link rel="stylesheet" href="/nc_res/index.css" />
</head>
<body>
<div class="body">

	<div class="aside">
		
		<section class="logo">
		<h1>NEURON</h1>
		</section>
		
		<section class="channel apidocs">
			<header><h2>API DOCS</h2></header>
			{docs}
		</section>
		
		<section class="channel unittests">
			<header><h2 data-link="/test/unit/all.html">UNIT TESTS<a href="jscoverage_lib/jscoverage.html?/test/unit/all.html" target="_blank">c</a></h2></header>
			{tests}
		</section>
		
	</div>
	<div class="docbg">
		<div class="board"></div>
	</div>
	<div id="main">
		<article class="markdown-article"></article>
	</div>
	
	<script type="text/javascript">
		NR.provide(['io/ajax','dom/dimension'],function(D,Ajax,Dim){
			var main = $('#main article');
			var modules = $('.apidocs .module');
			var pre = null;
			var current_module = $.one('.apidocs .module');
			
			var Actions = {
				"toggle":function(){
					var el = $(this);
					
					
					el.parent().one('.on').removeClass('on');
					if(el.data("open")){
						el.data("open",false);
						el.removeClass("on");
					}else{
						el.data("open",true);
						el.addClass("on");
					}
					
				},
				
				"paint":function(){
					// var el = $(this);
					// pre && pre.removeClass("on");
					// el.addClass("on");
					// pre = el;
				},
				
				"load":function(){
					var el = $(this);
				
					new Ajax({
						url:el.attr('data-link'),
						dataType:"html"
					}).on('success',function(content){
						main.html(content);
					}).send();
				},
				
				"frame":function(){
					var el = $(this),
						iframe = $.create('iframe').attr('src',el.attr('data-link'));
						loading = $.create('img').attr('src','/nc_res/loading.gif');
						
					iframe.on('load',function(){
						var frm = this;
						setTimeout(function(){
							//var height = frm.ownerDocument.body.offsetHeight;
							//console.log(height);
							loading.destroy();
							iframe.css('display','block');	
						},250);
						loading.destroy();
					});
					main.empty().grab(loading).grab(iframe);
				}
			}
			
			
			// 展开/收起	
			$('.channel .module,.channel .item').on('click', function(e){
				e.prevent();
				Actions.toggle.call(this)
			});
			
			
			// 载入文档
			$('.apidocs .item,.apidocs .module .title').on('click',function(e){
				e.prevent();
				Actions.paint.call(this);
				Actions.load.call(this);
			});
			
			// 载入ut
			$('.unittests .item,.unittests .module .title').on('click',function(e){
				e.prevent();
				Actions.paint.call(this);
				Actions.frame.call(this);
			});
			
			
			
			// 初始化
			$('.module').forEach(function(mod){
				mod = $(mod);
			});
			
			Actions.paint.call($('.module .title').get(0));
			Actions.toggle.call($('.module').get(0));
		});
		
	</script>
</div></body>
</html>
