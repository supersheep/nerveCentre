

var routes = [
	{name:"icon",test:/^\/favicon.ico$/},
	{name:"index",test:/^\/$/},
	{name:"ut",test:/^\/test\/unit/}
];

routes["default"] = {name:"neuron"};

module.exports = routes;