

var routes = [
	{name:"icon",test:/^\/favicon.ico$/},
	{name:"index",test:/^\/$/},
	{name:"ut",test:/^\/test\/unit/},
	{name:"utcases",test:/^\/testcases.json$/}
];

routes["default"] = {name:"neuron"};

module.exports = routes;