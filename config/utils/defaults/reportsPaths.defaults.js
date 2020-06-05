var RocketchatHelper = require ("../helpers/Rocketchat.helper");
var processEslint = RocketchatHelper.processEslint;
var processUnitTest = RocketchatHelper.processUnitTest;
var processE2e = RocketchatHelper.processE2e;

module.exports = {
	// String: the base of the directory where the reports will go
	// relative to karma.base
	base: '../test/reports',

	// Object: the different type of reports that will be generated
	// other attributes will be programatically generated 
	// in the preprocess stage below
	// relative to base
	types: {

		// Object: The setting for each type
		eslint: {

			// String: folder directory to this type of reports
			dir: '/eslint',

			// String: common filename throughout
			filename: 'eslint-report',

			// Array(String) : the type of formats to be generated
			formats: ['checkstyle', 'json'],

			// Object: setting for if this report 
			// is to be sent to rocketchat
			rocketchat: {

				// Boolean: If set to true, will return loop through all the files in the folder
				multi: false,

				// String: data type of the report data to be processed
				data: 'json',

				// Function(data:String): the function that will process the data
				processor: processEslint
			}
		},
		
		// required
		unitTest: {
			dir: '/unit-test',
			filename: 'unit-test-report',
			formats: ['junit'],
			rocketchat: {
				data: 'junit',
				processor: processUnitTest
			}
		},
	
		coverage: {
			dir: '/coverage',
			filename: 'coverage-report',
			formats: ['cobertura', 'html']
		},

		e2e: {
			dir: '/e2e',
			filename: 'e2e-report',
			formats: ['junit', 'json'],
			rocketchat: {
				multi: true,
				data: 'junit',
				processor: processE2e
			}
		}
	},

	// match format to file extension
	fileExtensions: {
		checkstyle: '.xml',
		junit: '.xml',
		cobertura: '.xml',
		html: '.html',
		json: '.json',
		default: '.txt',
		js: '.js'
	},

	ext : function (format) { return this.fileExtensions[format] == null 
								   ? this.fileExtensions.default 
								   : this.fileExtensions[format]; }
}

//Format after preprocessing: 
// paths = {
// 	base : //base path
// 	types : {
// 		type #1: {
// 			dir: //directory
// 			filename: //filename
// 			formats: [
// 				format1: 'format1',
// 				format2: 'format2',
// 				...
// 			],
// 			outputDir: [
// 				format1: //path to folder containing report of format1
// 				format2: //path to folder containing report of format2
// 				...
// 			],
// 			outputFile: [
// 				format1: //path to file containing report of format1
// 				format2: //path to file containing report of format2
// 				...
// 			]
// 		}
// 		...
// 	}
// }