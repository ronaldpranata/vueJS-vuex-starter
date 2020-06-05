var E2EHelper = {}

// given the key of the browser
// returns the name of the browser 
// most of their name is the same as the key 
// except some special ones like internet explorer
E2EHelper.getBrowserNames = function (browser) {
	switch(browser) {
		case 'ie': return "internet explorer";
		default: return browser;
	}
}

// Generate each browser object for nightwatch config
E2EHelper.generateBrowsers = function (browsers) {
	obj = {}
	browsers.forEach (function (browser, index) {
		obj[browser] =  {
			desiredCapabilities: {
		        browser: E2EHelper.getBrowserNames(browser)
		    }
		}
	});

	return obj;
}

// the config is valid only either all 3 values are 
// user defined or 
// default from environment(process.env)
E2EHelper.validConfig = function (e2eOptions) {
	return  (// all 3 values are env variable 
			(e2eOptions.browserstack.username == process.env.BROWSERSTACK_USERNAME &&
			e2eOptions.browserstack.key == process.env.BROWSERSTACK_KEY &&
			e2eOptions.browserstack.binarypath == process.env.BROWSERSTACK_BINARY_PATH) ||
			// all 3 values are NOT env variable
			(e2eOptions.browserstack.username != process.env.BROWSERSTACK_USERNAME &&
			e2eOptions.browserstack.key != process.env.BROWSERSTACK_KEY &&
			e2eOptions.browserstack.binarypath != process.env.BROWSERSTACK_BINARY_PATH)
		);
}

// function to display messaged when e2e test has been skipped
E2EHelper.skip = function (msg) {
	console.log ("Skipping e2e tests");
	console.log ("To Execute e2e tests:");
	return console.log (msg);
}

module.exports = E2EHelper;