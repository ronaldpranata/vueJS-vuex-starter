var ConfigHelper = require ("../helpers/Config.helper");
var generateReporterList = ConfigHelper.generateReporterList;
var loadKarmaReporterOptions = ConfigHelper.loadKarmaReporterOptions;
var nameFormatter = ConfigHelper.junitReporter.nameFormatter;
var classNameFormatter = ConfigHelper.junitReporter.classNameFormatter;
var generateCoverageReporterConfig = ConfigHelper.generateCoverageReporterConfig; 

module.exports = {

	// String: path to base relative to karma.config.js
	base: '../src', 

	// String: path to test's entry file relative to base
	// 		define more file in karma.config.js
	files: '../test/unit/index.js',

	// Array(String): a list of preprocessor for test's entry file ONLY
	// 		define more preprocessors for other files in karma.config.js
	filePreprocessor:  ['webpack', 'coverage'],
	reporters: ['spec', 'coverage'],

	// String: path to webpack config relative to karma.config.js
	webpack: '../build/webpack.test.conf.js', 

	// Number: port number for karma server to run on
	port: 9876,

	// I think we shouldn't expose this to public... 
	// Function (KarmaConfigObj, PreProccessedKarmaOption): 
	// 		a function to be called to load up the reporter options  
	// 		into KarmaConfigObj
	loadReporterOptions: loadKarmaReporterOptions,
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