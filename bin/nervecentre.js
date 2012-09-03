#! /usr/bin/env node
ncrequire("../inc/base");
var ActionFactory = ncrequire("../actions/action_factory");

var cli = {};
/**
 * command line
 */
cli.NAME = "neuron";

var AVAILIABLE_ACTIONS = ncrequire("../actions.json");

/*
process.on('uncaughtException', function (err) {
	console.dir(err);
	process.exit(1);
});
 */



/**
 * prepare actions
 */
AVAILIABLE_ACTIONS.forEach(function(actionName){
	cli[actionName] = ncrequire("../actions/"+actionName);
});

module.exports = cli;

/**
 * run from command line
 */
if(ncrequire.main){
	var PROJECT_CONFIG = ncrequire("../package.json");

	var args = process.argv;
	var command = args[2];

	var version = PROJECT_CONFIG.version;

	if(command === "-v" || command === "--version"){
		console.info("v"+version);
	}


	var Action = cli["help"];
	if(cli[command]){
		Action = cli[command];
	}
	
	new Action(args.slice(3)).run();
}
