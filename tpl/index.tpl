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
		
		body{background-color: #24334D;color:#f5f5f5;text-shadow: 0px 1px 3px rgba(0,0,0,0.2);font-family: Letter Gothic Std;}
		
		.body{margin:0 auto;height:100%;overflow: hidden;}
		
		.aside{position:fixed;height:100%;background-color: #5D7691;width:200px;text-align: center;}
		
		.aside .logo{background-color: #1a2731;padding:40px 20px;}
		.aside .logo h1{font-size: 36px;color: #ffe86f;}
		
		
		
		.aside .apidocs{text-shadow: 0px 1px 3px #ccc;}
		.aside .apidocs header{padding:30px;}
		
		.aside .apidocs .module{-webkit-transition:all .5s;height:33px;overflow: hidden;}
		.aside .apidocs .module:hover,
		.aside .apidocs .on{background-color: #44607A;}
		.aside .apidocs .on{height:auto;}
		.aside .apidocs .on .title{background-color: #24334D;color:#ffe86f;}
		
		.aside .apidocs .title{padding:5px;cursor: pointer;}
		.aside .apidocs .item{padding:5px;cursor: pointer;-webkit-transition:all .5s;}
		.aside .apidocs .module .on,
		.aside .apidocs .item:hover{background-color: #24334D; }
		
		.aside .apidocs .item a:after{content:" ⋙";}
		
		
		#main{margin-left:200px;padding:40px;}
		#main article{border:1px solid #ccc;background: #f5f5f5;padding:20px;color:#333;}
	</style>
</head>
<body>
<div class="body">

	<div class="aside">
		
		<section class="logo">
		<h1>NEURON</h1>
		</section>
		
		<section class="apidocs">
			<header><h2>API DOCS</h2></header>
			{docs}
		</section>
		
	</div>
	<div id="main">
		<article></article>
	</div>
	
	<script type="text/javascript">
		DP.provide(['io/ajax'],function(D,Ajax){
			var main = $('#main article');
			var modules = $.all('.apidocs .module');
			var pre = null;
			var current_module = $('.apidocs .module');
			
			modules.forEach(function(mod){
				mod = $(mod);
				if(!mod.hasClass('on')){
					mod.css('height',33);
				}else{
					mod.css('height',mod.attr('data-height'));
				}
			});
						
			$.all('.apidocs .module').on('click',function(){
				var el = $(this);
				
				current_module.removeClass('on');
				current_module.css('height',33);
				el.addClass('on');
				el.css('height',el.attr('data-height'));
				current_module = el;
			});
			
			$.all('.apidocs .item').on('click',function(){
				var el = $(this);
					a = el.one('a');
				
			
				pre && pre.removeClass("on");
				el.addClass("on");
				pre = el;
				new Ajax({
					url:a.attr('href'),
					dataType:"html"
				}).on('success',function(content){
					main.html(content);
				}).on('error',function(e){
					console.log("err",e);
				}).send();
				return false;
			})		
		});
		
	</script>
</div></body>
</html>