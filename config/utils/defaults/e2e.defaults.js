module.exports = {
	browserstack: {
		// This three values have to either be 
		// all from the environment or 
		// all user defined 
		username: process.env.BROWSERSTACK_USERNAME,
		key: process.env.BROWSERSTACK_KEY,
		binarypath: process.env.BROWSERSTACK_BINARY_PATH
	},

	config: {
		//standard nightwatch config

		src_folders : [ "test/e2e" ],

		selenium : {
			"start_process" : false,
			"host" : "hub-cloud.browserstack.com",
			"port" : 80
		},

		common_capabilities: {
			'build': 'project-template',
			'browserstack.debug': true,
			'browserstack.local': true
		},

		test_settings: {
			default: {}
		}
	},

	// the list of browsers that the test cases will be tested on
	browsers: ['chrome'], //['chrome', 'ie', 'firefox', 'safari'],

	// sets 
	//		- output_folder
	// 		- username and access key of browserstack
	// 		- browsers 
	preprocess: function (e2e, pathToApp, reportsPaths) {
		var generateBrowsers = require ("../helpers/E2E.helper").generateBrowsers;
		var path = require ("path");

		e2e.config.output_folder = path.join(pathToApp, reportsPaths.types.e2e.outputDir['junit']);
		e2e.config.common_capabilities['browserstack.key'] = e2e.browserstack.key;
		e2e.config.common_capabilities['browserstack.user'] = e2e.browserstack.username;

		var browsersObj = generateBrowsers(e2e.browsers);
		for (var key in browsersObj) {
			e2e.config.test_settings[key] = browsersObj[key];
		};

		return e2e;
	}, 

	// flag to see if e2e test should
	// run in jenkins
	run:false

}