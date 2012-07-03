<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<title>{title}</title>
	<script type="text/javascript">var __loaderConfig={appBase:"s/j/app/",libBase:"{libbase}",server:"{server}"};</script>
	<script type="text/javascript" src="http://i1.dpfile.com/lib/1.0/neuron-active.min.v2.js"></script>
	<!--script src="http://{server}/{env}{libbase}neuron-active.js"></script-->
	<script>DP.__loader.init();</script>
	<script type="text/javascript" src="/tools/jasmine/jasmine.js"></script>
	<script type="text/javascript" src="/tools/jasmine/jasmine-html.js"></script>
	<link rel="stylesheet" href="/tools/jasmine/jasmine.css" />
</head>
<body>
	{html}
	<script type="text/javascript">(function(){var jasmineEnv=jasmine.getEnv();jasmineEnv.updateInterval=1000;var htmlReporter=new jasmine.HtmlReporter();jasmineEnv.addReporter(htmlReporter);jasmineEnv.specFilter=function(spec){return htmlReporter.specFilter(spec);};var currentWindowOnload=window.onload;window.onload=function(){if(currentWindowOnload){currentWindowOnload();}execJasmine();};function execJasmine(){jasmineEnv.execute();}})();</script>
</body>
</html>
