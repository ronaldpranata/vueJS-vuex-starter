var helper = require ("./utils/functions/helpers");
var processEslint = helper.RocketchatHelper.processEslint;
var processUnitTest = helper.RocketchatHelper.processUnitTest;
var loadKarmaReporterOptions = helper.ConfigHelper.loadKarmaReporterOptions;
var generateReporterList = helper.ConfigHelper.generateReporterList;
var nameFormatter = helper.ConfigHelper.junitReporter.nameFormatter;
var classNameFormatter = helper.ConfigHelper.junitReporter.classNameFormatter;
var generateCoverageReporterConfig = helper.ConfigHelper.generateCoverageReporterConfig;

module.exports.userDefault = { 
	projectTitle: 'default1', 
	karma:{}, 
	eslint:{}, 
	reportsPaths:{ eslint: {}, reportsPaths: {}, karma: {}}, 
	jenkins: {rocketchatChannel: '', email: ''}
}

module.exports.reportsPaths = {
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
		}
	},

	// match format to file extension
	fileExtensions: {
		checkstyle: '.xml',
		junit: '.xml',
		cobertura: '.xml',
		html: '.html',
		json: '.json',
		default: '.txt'
	},

	ext : function (format) { return this.fileExtensions[format] == null 
								   ? this.fileExtensions.default 
								   : this.fileExtensions[format]; }
}

module.exports.eslint = {
	// paths are relative to package.json

	// String: path to app folder
	pathToApp: './src', 
	// String: path to files to be checked
	files: './src'
}

module.exports.karma = {

	// String: path to base relative to karma.config.js
	base: '../src', 

	// String: path to test's entry file relative to base
	// 		define more file in karma.config.js
	files: ['../../node_modules/babel-polyfill/dist/polyfill.js', '../test/unit/index.js'],

	// Array(String): a list of preprocessor for test's entry file ONLY
	// 		define more preprocessors for other files in karma.config.js
	filePreprocessor:  ['webpack', 'coverage'],
	frameworks: ['mocha', 'sinon-chai'],
	
    reporters: [ 'coverage'],

	// String: path to webpack config relative to karma.config.js
	webpack: '../build/webpack.test.conf.js', 

	// Number: port number for karma server to run on
	port: 9876,

	// I think we shouldn't expose this to public... 
	// Function (KarmaConfigObj, PreProccessedKarmaOption): 
	// 		a function to be called to load up the reporter options  
	// 		into KarmaConfigObj
	loadReporterOptions: function (karma, karmaOptions) {
	    var key;
	    for (var i = 0; i < karmaOptions.reporters.length; i++) {
	        key = karmaOptions.reporters[i] + 'Reporter';
	        if (karmaOptions.reporterOptions[key] != null) {
	        	// checks if there's options defined for the reporter
	            karma[key] = karmaOptions.reporterOptions[key];
	        }
	    }
	},

	// I think we shouldn't expose this to public... 
	// but the properties added can be exposed
	//
	// Function (KarmaOption, PreprocessedReportsPaths):
	// 		This is to be called only after reportPaths have been preprocessed
	// 		at options.config.js where all the paths are ready, then
	// 		proceed to populate these options into karmaOption
	preprocess: function (karmaOption, reportsPaths) {

		// Array(String): a list of reporter karma will use
		karmaOption.reporters = generateReporterList (reportsPaths);

		// Object: a collection of reporters "<dataType>Reporter"
		// reporter options follow the individual official documentations
		karmaOption.reporterOptions = {
			junitReporter: {
				outputDir: reportsPaths.types
					.unitTest.outputDir.junit, 
	            outputFile: "../" + reportsPaths.types
	            	.unitTest.filename.junit,
				nameFormatter: nameFormatter,
		        classNameFormatter: classNameFormatter
			},

			htmlReporter: {
	          outputFile: reportsPaths.types
	          	.unitTest.outputFile.html // './reports/unit-test/html/unit-test-report.html'
	        },

	        //coverage reporter option
	        coverageReporter: {
	   			// generate the reporters programatically 
	            reporters : generateCoverageReporterConfig (
	            	reportsPaths.types.coverage
	            )
	        }
		}

		return karmaOption;
	}
}

module.exports.jenkins = {
	email: '',
	rocketchatChannel: ''
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