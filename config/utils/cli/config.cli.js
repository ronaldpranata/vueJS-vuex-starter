var ConfigGenerator = require("../helpers/classes/ConfigGenerator/ConfigGenerator");
var ConfigGeneratorHelper = require ("../helpers/ConfigGenerator.helper");

var setup = {

	// project config file
	// if in development, uses dev.config file
	file: (process.env.DEVELOPMENT) ? "./project.dev.config.js" : "./project.config.js",

	// defaults of project config
	config: require ("../options.config").userDefaults,

	// Questions to be asked 
	queries: [
		{
			question: "Project Title",
			key: ['projectTitle']
		},
		{
			question: "Rocketchat Channel",
			key: ['jenkins', 'rocketchatChannel']
		},
		{
			question: "Email",
			key: ['jenkins', 'email']
		},
		/*
		{
			question: "Browsers for End-to-End testings",
			key: ['e2e', 'browsers'],
			mcq: ['chrome', 'ie', 'firefox', 'safari'],
			multipleAnswer: true,
			handler: function (msg) {
				return msg.filter (function(value, index, self) {
					return self.indexOf(value) === index;
				});
			}
		},*/
		{
			question: "Project Git repo \n>> For setting up local remote (Blank to skip step)",
			handler: ConfigGeneratorHelper.gitConfigHandler
		}
	]
}

ConfigGenerator.start(setup);
