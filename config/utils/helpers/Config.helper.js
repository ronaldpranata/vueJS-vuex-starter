var ConfigHelper = {};

// PRE: takes in paths object with populated value
// POST: paths object with 
//		 - outputDir path
//		 - outputFile paths
//		 - filename with extensions
ConfigHelper.preprocess_paths = function (paths) {

	var subfolder;
	var filename;
	var filenameExt;
	var formatObj = {} //format in obj form

	for (var key in paths.types) {
		var currentType = paths.types[key];

		//init empty objects
		currentType['outputDir'] = {};
		currentType['outputFile'] = {};
		formatObj = {};

		filename = currentType.filename;
		currentType.filename = {};

		if (currentType.formats) {
			currentType.formats.forEach(function(format, index, arr){
				//filename with ext
				filenameExt = filename + paths.ext(format);
				currentType.filename[format] = filenameExt;

				//folder path
				subfolder = paths.base + currentType.dir + '/' + format; 
				currentType['outputDir'][format] = subfolder; 

				//folder path + filename
				currentType['outputFile'][format] = subfolder + '/' + filenameExt

				//change format from array to obj
				formatObj[format] = format;
			});
		}
		

		//update currentType format
		currentType.formats = formatObj;
	};

	return paths;
}

// PRE: CoverageConfig passed in with all the neccesary values
// POST: returns a configuration for the Coverage Reporter 
ConfigHelper.generateCoverageReporterConfig = function (coverageConfig) {
	var reporterConfig = []
	for (var format in coverageConfig.formats) {
		reporterConfig.push({
			type: coverageConfig.formats[format],
            dir: coverageConfig.outputDir[format],
            file: '../' + coverageConfig.filename[format]
		});
	}
	return reporterConfig;
}

// Functions for junitReporter to use to generate name and className
ConfigHelper.junitReporter = {
	nameFormatter: function (browser, result) {
        return result.suite.join(" >> ") + " >> " + result.description;
    },
    classNameFormatter: function (browser, result) {
        var pkg = result.suite[0];
        var token = result.description.match(/@@[a-zA-Z0-9]+/g);
        var className = (token === null) ?  result.suite[1] : token[0];
        return pkg + "." + className;
    }
}

// PRE: reportsPath already preprocessed 
// POST: an array of reporters string generated
ConfigHelper.generateReporterList = function (reportsPaths) {
	var types = reportsPaths.types;
	var reporters = ['progress'];

	if (types.unitTest != null &&
		types.unitTest.formats != null) {
		for (var format in types.unitTest.formats) {
			// for unit test,
			// add all the formats into reporter
			reporters.push(format);
		}
	} 

	if (types.coverage != null) {
		// as long as there's coverage, add it into reporters
		reporters.push ("coverage");
	}

	return reporters;

}

// PRE: karmaOptions already preprocessed
// POST: karma config object will have reporter options
ConfigHelper.loadKarmaReporterOptions = function (karma, karmaOptions) {
    var key;
    for (var i = 0; i < karmaOptions.reporters.length; i++) {
        key = karmaOptions.reporters[i] + 'Reporter';
        if (karmaOptions.reporterOptions[key] != null) {
        	// checks if there's options defined for the reporter
            karma[key] = karmaOptions.reporterOptions[key];
        }
    }
}

module.exports = ConfigHelper;