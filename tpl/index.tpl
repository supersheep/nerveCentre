<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<title>Neuron</title>
	<script type="text/javascript">var __loaderConfig={appBase:"s/j/app/",libBase:"{libbase}",server:"{server}"};</script>
	<script type="text/javascript" src="http://i1.dpfile.com/lib/1.0/neuron-active.min.v2.js"></script>
	<script>DP.__loader.init();</script>
	<style type="text/css">
		body,h1,h2,h3,img,ul,li{padding:0;margin:0;}
		ul{list-style-type: none;}
		a{color:#f5f5f5;text-decoration: none;}
		
		body{color:#f5f5f5;text-shadow: 0px 1px 3px rgba(0,0,0,0.2);font-family: Letter Gothic Std;}
		iframe{border:0;width:100%;display:none;height:500px;}
		
		.body{margin:0 auto;height:100%;overflow: hidden;}
		
		.aside{position:fixed;height:100%;background-color: #5D7691;width:200px;text-align: center;z-index: 10;}
		
		.aside .logo{background-color: #1a2731;padding:40px 20px;}
		.aside .logo h1{font-size: 36px;color: #ffe86f;}
		
		.aside header,.aside .module{border-bottom: 1px solid #8694ab;}
		
		.aside .channel{text-shadow: 0px 1px 3px #ccc;}
		.aside .channel header{padding:30px;}
		
		.aside .channel .module{-webkit-transition:all .5s;overflow: hidden;}
		.aside .channel .module:hover,
		.aside .channel .on{background-color: #44607A;}
		.aside .channel .on{height:auto;}
		.aside .channel .on .on a,{background-color: #24334D;color:#ffe86f;}
		
		.aside .channel .title{padding:5px;cursor: pointer;}
		.aside .channel .item{padding:5px;cursor: pointer;-webkit-transition:all .5s;}
		.aside .channel .module .on,
		.aside .channel .item:hover{background-color: #24334D; }
		
		.aside .channel .item a:after{content:" ⋙";}
		
		.docbg{position: fixed;height: 100%;width:100%;background-color:#24334D; }
		.docbg .board{margin:0 40px 0 240px;height:100%;background-color: #eee;}
		
		#main{margin-left:200px;padding:0 40px;position: relative;}
		#main article{border:1px solid #ccc;border-top:none;border-bottom:0;position:relative;height:100%;z-index:5;padding:60px 20px;color:#333;}
	</style>
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
			<header><h2>UNIT TESTS</h2></header>
			{tests}
		</section>
		
	</div>
	<div class="docbg">
		<div class="board"></div>
	</div>
	<div id="main">
		<article></article>
	</div>
	
	<script type="text/javascript">
		DP.provide(['io/ajax','dom/dimension'],function(D,Ajax,Dim){
			var main = $('#main article');
			var modules = $.all('.apidocs .module');
			var pre = null;
			var current_module = $('.apidocs .module');
			
			var Actions = {
				"toggle":function(){
					var el = $(this);
					
					current_module.removeClass('on');
					current_module.css('height',33);
					el.addClass('on');
					el.css('height',el.data('height'));
					current_module = el;
				},
				"paint":function(){
					var el = $(this);
					pre && pre.removeClass("on");
					el.addClass("on");
					pre = el;
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
						loading = $.create('img').attr('src','/res/loading.gif');
						
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
			$.all('.channel .module').on('click',Actions.toggle);
			
			
			// 载入文档
			$.all('.apidocs .item,.apidocs .module .title').on('click',function(){
				Actions.paint.call(this);
				Actions.load.call(this);
			});
			
			// 载入ut
			$.all('.unittests .item,.unittests .module .title').on('click',function(){
				Actions.paint.call(this);
				Actions.frame.call(this);
			});
			
			
			
			// 初始化
			$.all('.module').forEach(function(mod){
				mod = $(mod);
				mod.data('height',Dim.size(mod).height);
				mod.css('height',33);
			});
			Actions.paint.call($('.module .title').el(0));
			Actions.toggle.call($('.module').el(0));
		});
		
	</script>
</div></body>
</html>