var routes = [
	{name:"icon",test:/^\/favicon.ico$/},
	{name:"index",test:/^\/$/},
	{name:"doc",test:/^\/docs\/.*\.html$/},
	{name:"ut",test:/^\/test\/unit.*\.html$/},
	{name:"utcases",test:/^\/testcases.json$/}
];

routes["default"] = {name:"neuron"};

module.exports = routes;