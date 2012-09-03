var event = ncrequire('events').EventEmitter;
var fs = ncrequire('fs');

//比较文件夹
function Watcher(dirname,interval){	
	var self = this;
	var olds;
	setInterval(function(){
		
		fs.readdir(dirname,function(err,files){
			if(err){
				return;
			}
			var news = files.join('|');
			if(news != olds){
				self.emit("change",files);
			}
			olds = news;
		});
	},interval);	
}

Watcher.prototype = new event;

exports.Watcher = Watcher;