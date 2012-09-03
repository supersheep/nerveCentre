#! /usr/bin/env node
require("../inc/base");
var ActionFactory = require("../actions/action_factory");

var cli = {};
/**
 * command line
 */
cli.NAME = "neuron";

var AVAILIABLE_ACTIONS = require("../actions.json");

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
	cli[actionName] = require("../actions/"+actionName);
});

module.exports = cli;

/**
 * run from command line
 */
if(require.main){
	var PROJECT_CONFIG = require("../package.json");

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
