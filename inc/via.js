function via(router){
	return require('../router/'+router);	
}

module.exports = via;