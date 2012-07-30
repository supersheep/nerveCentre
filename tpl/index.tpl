<!DOCTYPE HTML>
<html lang="en-US">
<head>

<meta charset="UTF-8">
<title>Neuron</title>
<script type="text/javascript">var __loaderConfig={appBase:"s/j/app/",libBase:"{libbase}",server:"{server}"};</script>
<script src="http://{server}/{env}{libbase}neuron-active.js"></script>
<script>var NR = window.DP || window.KM; NR.__loader.init();</script>

<style type="text/css">


/* reset */
html{color:#000;background:#FFF}
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,button,textarea,select,p,blockquote,th,td
{margin:0;padding:0}

table{border-collapse:collapse;border-spacing:0}

fieldset,img{border:0}
address,/* button, */caption,cite,code,dfn,em,input,optgroup,option,select,/* strong, */textarea,th,var
{font-style:normal; font-weight:normal; }

/* del, */ ins{text-decoration:none}
// li{list-style:none}
caption,th{text-align:left}

/* h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:normal} */

q:before,q:after{content:''}
abbr,acronym{border:0;font-variant:normal}
sup{vertical-align:baseline}
sub{vertical-align:baseline}
legend{color:#000}
a{text-decoration: none;}


/* global */

body{text-shadow: 0px 1px 0 rgba(255,255,255,1); font-family: Letter Gothic Std;}

hr{
    display:none;
}


/* .markdown-article */
.markdown-article{
    font-family: Monaco, Helvetica, Arial, freesans, 'Hiragino Sans GB', 'STHeiti', Letter Gothic Std, sans-serif;
    background:#f5f5f5;
}

.markdown-article h1{
    color:#000;
    font-size: 2em;
    text-transform:uppercase; 
    margin-bottom:20px; 
    padding-top:20px;
}

.markdown-article h2{
    color:#111;
    font-size: 1.7em;
    padding: 15px 0 5px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
    /* -webkit-border-image: -webkit-linear-gradient(left, #ccc 0%, #777 20%, #fcfcfc 100%) 0 0 1px 0 repeat repeat; */
}

.markdown-article h3{
    color:#222;
    font-size: 1.4em;
    padding-top:15px; 
    margin-bottom:10px;
}

.markdown-article h4{
    color:#333;
    font-size: 1.2em;
    padding-top:10px;
    margin-bottom:5px;
}

.markdown-article h5, .markdown-article h6{
    color:#444;
    font-size: 1em; 
    padding-top:5px;
    margin-bottom:3px;
}

.markdown-article p{margin-bottom:5px;}

.markdown-article ul, .markdown-article ol{
    padding: 10px 40px;
    color: #555;
}

.markdown-article code{
    margin: 0px 2px;
    padding: 0px 3px 2px;
    border: 1px solid #ccc;
    border-radius: 3px;
    position: relative;
    top: -2px;
}

.markdown-article pre > code{
    border: none;
}

.markdown-article pre {
    margin:10px 0;
    border: 1px solid #CCC;
    overflow: auto;
    padding: 8px 10px 6px;
    border-radius: 3px;
    background:#f0f0f0;
    box-shadow: 0 1px 0 rgba(0,0,0,.02)
}

.markdown-article code, .markdown-article pre{
    /* font-family: Monaco, 'Hiragino Sans GB', monospace; */
}

iframe{border:0;width:100%;display:none;height:500px;}

.body{margin:0 auto;height:100%;overflow: hidden;}

.aside{color:#f0f0f0; position:fixed;height:100%;background-color: #5D7691; width:200px; text-align: center; z-index: 10;overflow:auto;}

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


.aside .channel .title a,.aside .channel .item a{color:#fff;margin-left:5px;border-bottom:1px dashed #fff;}
.aside .channel .item:after{content:" ⋙";}

.docbg{position: fixed;height: 100%;width:100%;background-color:#24334D; }
.docbg .board{margin:0 40px 0 240px;height:100%;background-color: #eee;}

#main{margin-left:200px;padding:0 40px;position: relative;}

#main article{
    border:1px solid #ccc;
    border-top:none;
    border-bottom:0;
    position:relative;
    height:100%;
    z-index:5;
    padding:40px 20px 60px;
    color:#333;
}

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
			$('.channel .module').on('click', Actions.toggle);
			
			
			// 载入文档
			$('.apidocs .item,.apidocs .module .title').on('click',function(){
				Actions.paint.call(this);
				Actions.load.call(this);
			});
			
			// 载入ut
			$('.unittests .item,.unittests .module .title').on('click',function(){
				Actions.paint.call(this);
				Actions.frame.call(this);
			});
			
			
			
			// 初始化
			$('.module').forEach(function(mod){
				mod = $(mod);
				mod.data('height',Dim.size(mod).height);
				mod.css('height',33);
			});
			
			Actions.paint.call($('.module .title').get(0));
			Actions.toggle.call($('.module').get(0));
		});
		
	</script>
</div></body>
</html>
