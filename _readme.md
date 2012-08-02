nerveCentre手册
======
为neuron框架提供静态文件打包及测试服务的node服务器


I.如何启动服务
=====

步骤
---
1. clone nerveCentre项目
	
		git clone git@f2e.dp:nervecentre.git

2. npm link (windows上npm link是坏的，使用setup.bat简单的替代之)

		cd nerveCentre
		npm link

3. clone neuron项目
	
		git clone git@f2e.dp:neuron.git
	
4. 进入neuron目录并启动
	
		neuron start . -d
	
说明：
----

1. 第三个参数 `"."` 表示以当前目录为根目录启动服务。也可以手动指定路径。
	支持除了父级目录之外的大多目录表达语法。
	也可在公用配置中指定绝对路径，以省略该参数。
2. -d表示以develop环境的配置启动服务。不加则以product配置启动


II.配置
======


参数说明
-----
1. origin 默认根目录
2. expires 静态文件缓存过期时间 
3. port 服务的访问端口。（若useproxy为true，则以此作为静态文件服务访问端口。）
4. staticport 静态服务的访问端口，
5. useproxy 是否对branch目录进行代理
6. showhome 是否在 / 显示主页
7. libbase 供neuron配置使用的libbase参数
8. libpath 会进行打包处理的文件夹路径集
9. filters 响应输出过程中做额外处理的过滤器，在inc/filters.js中定义

默认配置
-----
	
	var common = {
		origin : '',
		expires : {
	   		fileMatch: /^(gif|png|jpg|js|css)$/ig,
		    maxAge: 60*60*24*365
		}
	}
	
	var product = {
		port:'1337',
		staticport:'1339',
		libbase: 'lib/1.0/',
		libpath : ['/lib/1.0','/lib','/s/j/app'],
		useproxy:true,
		filters : [
			'strict',
			'uglify',
			'proxycomment',
			'buildtime',
			'branch']
	}
	
	var develop = {
		port : '1337',
		staticport : '1339',
		libbase: 'lib/',
		libpath : ['/lib','/s/j/app'],
		useproxy : false,
		filters : [
			'strict',
			'uglify',
			'buildtime',
			'branch']
	}


III.书写测试用例
============

1. 单元测试用例存放在neuron的版本库中，目录位置为 /test/unit，其下的目录及文件结构与/lib目录保持一致。

2. 测试用例只支持使用jasmine语法书写。示例代码如下

		/test/unit/form/.js
		
		describe("简单预设 email",function(){
			it("name为email，test(\"aaa@163.com\")为true，hint为null",function(){
				var ready = false;	
				runs(function(){
					NR.provide('form/rule',function(D,Rule){
						ready = true;
						
						var r1 = Rule.produce("email");
					  	expect(r1.name).toEqual("email");
					  	expect(r1.test("aaa@163.com")).toEqual(true);
					  	expect(r1.hint).toEqual(null);
				  	});
				});
				
				waitsFor(function(){
					return ready;	
				});
			});
		});

3. 访问http://localhost:1337/test/unit/rule.html 即可看到测试结果
4. 若需要进行ui测试，可以建立.html文件，其中的内容会被添加到最终生成的文档里，body标签的顶部。若同时存在a.html与a.js，会优先访问前者。该部分示例用例尚未完成。

IV.与TestSwarm集成
====

1. 启动nervecentre服务
2. 访问 [http://jstest.dianpingoa.com/](http://jstest.dianpingoa.com/) 
3. 使用用户名neuron，密码neuron登录
4. 点击Addjob添加一枚测试任务，Auth token填写c4d21ae850ee6d7b9ff1e465e5c720986cea82b5，"Browsers"选择"default"。Run URL为测试页面的外部访问地址，如 http://192.168.63.167:1337/test/unit/rule.html。 其他随自己心情填（若使用自己添加的用户，需要向寸老师索取Auth token），完成添加。
5. 之后便可在Home页面观察到各浏览器的测试结果。