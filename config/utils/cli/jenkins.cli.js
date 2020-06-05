// This file prints data onto the console 
// for jenkins to pick up 

var path = require('path');
var options = require ('../options.config.js');
var JenkinsHelper = require ("../helpers/Jenkins.helper");
var filePaths = options.reportsPaths;

// Remove the first two item in the process.argv array
process.argv.shift();
process.argv.shift();
JenkinsCLI(process.argv);

// handles the arguments provided
function JenkinsCLI (args) {
	// Two kinds of data will be printed
	var method = args[0];

	
	args.shift();
	if (method == "ROCKETCHAT") {
		// Report summary
		var getReportSummary = JenkinsHelper.getReportSummary;
		getReportSummary(options, filePaths, function (result) {
			var i = 0;
			for (var key in result.data) { i++; }
			if (i < 1) 
				return console.log("No Reports Found!");

			var PrettyObjectPrinter = require("../helpers/Util.helper").PrettyObjectPrinter;
			console.log("```json\n" + PrettyObjectPrinter.print(result, false, "   ") + "\n```");
		});
	} else if (method == "VARIABLES") {
		// Paths to the reports
		printPaths ();
	}
}

// Prints path to repective reports
function printPaths () {
	var args = [
		"--unitTest", "junit", 
		"--coverage", "cobertura", 
		"--eslint", "checkstyle", 
		"--e2e", "junit"
	];
	var getReportsPath = JenkinsHelper.getReportsPath;
	console.log(getReportsPath(args, options.eslint.pathToApp, filePaths));

	if (options.jenkins.rocketchatChannel.length > 0)
		console.log(options.jenkins.rocketchatChannel);
	else 
		console.log("NULL");
}
