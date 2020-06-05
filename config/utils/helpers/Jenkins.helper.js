var Jenkins = {}
var path = require ("path");
var merge = require ("./Util.helper.js").merge;

// Pre:
//	args: An array of values that defines the reports to be requested for
//	pathToApp: String to the path to app
//	reportsPaths: The object that holds all the paths to reports
//	result: The accumulated string value
//
// Post:
//	returns A String with break line seperated paths 
//
// Calls iteratively
Jenkins.getReportsPath = function (args, pathToApp, reportsPaths, result = '') {
	if (args.length == 0) {
		// Terminates if there are no request
		return result; 
	}

	// Extracting information about the report we are getting
	var type = args.shift().trim().substring(2);
	var format = args.shift().trim();
	var filepath;

	// Joins the parts together to form the path to the report
	try {
		filepath = path.join(
			pathToApp, 
			reportsPaths.types[type].outputDir[format], 
			"*" + reportsPaths.fileExtensions[format]);
	} catch (e) {
		return e;
	}

	// Append onto result and calls iteratively
	result = (result.length > 0) ? result + "\n" + filepath : filepath;
	return Jenkins.getReportsPath (args, pathToApp, reportsPaths, result);
}

// ReportSummaryProcessor Class
// Processes Report file Synchronously 
function ReportSummaryProcessor () {
	this.result = {};
	this.resultSub;

	this.completed = 0;
	this.toComplete = 0;

	this.FileSystemHelper = require('../helpers/FileSystem.helper');
}

ReportSummaryProcessor.prototype.process = function (options, filePaths, callback = console.log) {
	// Title of project
	this.result.title = options.projectTitle;
	this.resultSub = this.result.data = {};
	 

	for (var type in filePaths.types) {
		// For each type of reports that has 
		// a valid rocketchat setting
		if (filePaths.types[type].rocketchat && 
			filePaths.types[type].rocketchat.data && 
			filePaths.types[type].rocketchat.processor) {

			// the processor that will process the 
			// test report's data and format it nicely to be
			// printed later.
			var processor = filePaths.types[type].rocketchat.processor

			if (filePaths.types[type].rocketchat.multi) {
				// If the type has multiple reports to be processed
				this.processMultiple (type, options, filePaths, callback, processor);
			} else {

				// path to file with desired report
				var outputFilePath = path.join (
					options.eslint.pathToApp, 
					filePaths.types[type].outputFile[filePaths.types[type].rocketchat.data]);


				this.processSingle (outputFilePath, processor, callback);
			}
		}
	}
}

ReportSummaryProcessor.prototype.processSingle = function (outputFilePath, processor, callback) {
	this.toComplete++;

	// reads the file and process after read file complete
	this.FileSystemHelper.readFile(
		outputFilePath, 
		this.readFileComplete.call(this, processor, callback)
	);
}

ReportSummaryProcessor.prototype.processMultiple = function (type, options, filePaths, callback, processor) {
	var outputDirPath = path.join (
		options.eslint.pathToApp,
		filePaths.types[type].outputDir[filePaths.types[type].rocketchat.data]);

	var allFiles = this.FileSystemHelper.getAllFilesOfTypeInFolder(outputDirPath, filePaths.ext(filePaths.types[type].rocketchat.data));

	for (var i in allFiles) {
		var outputFilePath = allFiles[i];
		this.processSingle (outputFilePath, processor, callback)
	}
}

ReportSummaryProcessor.prototype.isComplete = function () {
	return this.completed == this.toComplete;
}

// returns a function that takes in a data to be 
	// processed and printed nicely for us
ReportSummaryProcessor.prototype.readFileComplete = function (processor, callback) {
	var $this = this;
	return function(data){ $this.completed++; $this.processData (processor, data, callback); }
}

// process the data with processor 
// then proceed to print the processed data
ReportSummaryProcessor.prototype.processData = function (processor, data, callback) {
	if (!data.err)
		this.resultSub = merge(this.resultSub, processor(data));

	if (this.isComplete())
		return callback(this.result);
}



// Report summary includes 
// 		- Title of project 
//		- For each type of reports that 
//		  has a valid rocketchat setting
Jenkins.getReportSummary = function (options, filePaths, callback) {
	var processor = new ReportSummaryProcessor();
	processor.process (options, filePaths, callback);
}

module.exports = Jenkins