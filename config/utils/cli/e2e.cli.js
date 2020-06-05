require ("dotenv").config({path: "./config/.devenv"});
var e2eOptions = require ("../options.config.js").e2e;
var e2eHelper = require ("../helpers/E2E.helper");

var validConfig = e2eHelper.validConfig;
var skip = e2eHelper.skip;

// Terminate if invalid config
if (!validConfig (e2eOptions)) {
	return skip("If you did change browserstack credential,\n"
				+ "ensure that you change all three attribute:\n"
				+ "Username, Key and Binary Path");
}

// Terminate if not intended to run
if (!e2eOptions.run) {
	return skip ("Set run flag in project.config.js to `true`");
}

// generate the command to be executed
// execute nightwatch.runner.js with 
// 		-c config file : config/nightwatch.config.js
// 		-e browsers: list of browsers defined previously joined by `,`
var browsers = e2eOptions.browsers.join(",");
var command = "node config/utils/nightwatch.runner.js -c config/nightwatch.config.js -e " + browsers;

// Execute
var spawn = require ("child_process").spawn;
var e2eProcess = spawn ("node", ["config/utils/nightwatch.runner.js", "-c", "config/nightwatch.config.js", "-e", browsers]);

// Print out all data
e2eProcess.stdout.on('data', function (data) { console.log(data.toString()); })
e2eProcess.stderr.on('data', function (data) { console.log(data.toString()); })
e2eProcess.on('close', function (code) { console.log ("Closed on code: " + code); });
