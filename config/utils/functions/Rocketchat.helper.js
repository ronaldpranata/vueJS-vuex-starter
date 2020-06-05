var fileSystemHelper = require ("./FileSystem.helper");
var parseXML = fileSystemHelper.parseXML;
var RocketchatHelper = {}

// ESLint Data handling function
// PRE: a XML-format string data is passed
// POST: If user changed the data type but forgot to change the handler function,
//		 an error will be thrown
//		 else create and return a object that is formatted to be sent to rocketchat 
RocketchatHelper.processUnitTest = function(data) {
	try {
		// tries to parseXML
		// in case users changed data type without changing
		// the function to handle the data
		var dom = parseXML(data);
	} catch (e) {
		//logs error and return
		console.log(e);
		return;
	} 

	// successfully parseXML
	// this is how the result will be formatted
	var result = {
		success: 0,
		failure: {
			normal: 0,
		}
	}

	// find all the testcases
	var testcases = dom.documentElement.getElementsByTagName("testcase");
	var testcase;
	// total number of fail case for a full summary
	var failCount = 0;
	for (var i = 0; i < testcases.length; i++) {
		// for every testcase
		testcase = testcases[i];
		var classname = testcase.getAttribute("classname");
		var isFailure = testcase.getElementsByTagName("failure").length > 0;

		// if it is a fail case
		if (isFailure) {
			// increment the number of failed testcase
			failCount++;
			// attempt to extract the token
			var token = classname.match(/@@[a-zA-Z0-9]+/g);
			// tag is the token if any, else defaults to 'normal'
			var tag = (token == null) ? 'normal' : token[0];
			// store in result object
			result.failure[tag] = (result.failure[tag] == null) ? 1 : result.failure[tag] + 1;
		} else {

			// increment number of success count
			result.success++;
		}
	}

	result.failure.total = failCount;
	return {'unit-test' : result};
	
}

// ESLint Data handling function
// PRE: a XML-format string data is passed
// POST: If user changed the data type but forgot to change the handler function,
//		 an error will be thrown
//		 else create and return a object that is formatted to be sent to rocketchat 

RocketchatHelper.processEslint = function (data) {
	try {

		// tries to parse json
		// in case users changed data type without changing
		// the function to handle the data
		var json = JSON.parse(data);
	} catch (e) {
		//logs error and return
		console.log(e);
		return;
	} 

	// successfully parse json file
	var errorCount = warningCount = 0;

	// just a simple counting step
	json.forEach(function (data, index, arr){
		errorCount += data.errorCount;
		warningCount += data.warningCount;
	});

	return {
		"Lint Result" : {
			"Error Count" : errorCount,
			"Warning Count" : warningCount
		}
	};
}

module.exports = RocketchatHelper;