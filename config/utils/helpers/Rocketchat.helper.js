var fileSystemHelper = require ("./FileSystem.helper");
var parseXML = fileSystemHelper.parseXML;
var RocketchatHelper = {};

RocketchatHelper.processData = function (data, errHandler) {
	
	if (data.err) {
		return errHandler(data.err);
	}

	return data;
}

// ESLint Data handling function
// PRE: a XML-format string data is passed
// POST: If user changed the data type but forgot to change the handler function,
//		 an error will be thrown
//		 else create and return a object that is formatted to be sent to rocketchat 
RocketchatHelper.processUnitTest = function(data) {

	data = RocketchatHelper.processData(data, function (err) {
		return console.log (err);
	});

	try {
		// tries to parseXML
		// in case users changed data type without changing
		// the function to handle the data
		var dom = parseXML(data.data);
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
	return {'Unit Test' : result};
	
}

// ESLint Data handling function
// PRE: a XML-format string data is passed
// POST: If user changed the data type but forgot to change the handler function,
//		 an error will be thrown
//		 else create and return a object that is formatted to be sent to rocketchat 

RocketchatHelper.processEslint = function (data) {

	data = RocketchatHelper.processData(data, function (err) {
		return console.log (err);
	});

	try {

		// tries to parse json
		// in case users changed data type without changing
		// the function to handle the data
		var json = JSON.parse(data.data);
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

RocketchatHelper.processE2e = function (data) {

	data = RocketchatHelper.processData(data, function (err) {
		if (err.code == "ENOENT") {
			return null;
		}
	});

	if (data.data == null) {
		return {e2e : "No e2e reports"}
	}

	var file = data.info.filename.replace(/\//g, "\\").split("\\");
	var browserInfo = file[file.length - 1].split("_");
	var browser = browserInfo[0] + " v" + browserInfo[1];

	try {
		var xml = parseXML(data.data);
	} catch (e) {
		return console.log(e);
	}

	var testsuite = xml.getElementsByTagName("testsuite")[0];
	var result = {};
	result[browser] = {}
	var test = result[browser][testsuite.getAttribute("name")] = {
		tests: parseInt(testsuite.getAttribute("tests")),
		failures: parseInt(testsuite.getAttribute("failures")),
		skipped: parseInt(testsuite.getAttribute("skipped"))
	}

	return {e2e: result}
	

	
}

module.exports = RocketchatHelper;