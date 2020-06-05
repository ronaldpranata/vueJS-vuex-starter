var fileSystemHelper = require ("./FileSystem.helper");
var dirExist = fileSystemHelper.dirExist;
var createAndWrite = fileSystemHelper.createAndWrite;

var ESLintCLIHelper = {}

// PRE: fs.mkdir is called
// POST: a function that takes in error is returned as 
//		 the callback function
ESLintCLIHelper.mkdirCallback = function (fs, filepath, result, format) {

	// PRE: fs.mkdir callback
	// POST: display errors on console or 
	//		 proceed to write the reports
	return function (err) {
		if (!dirExist(err)) 
			// directory doesnt exist
			// probably failed to create directory
			return console.log(err);
			else {
			// proceed to write
			// if file doesn't exist, it'll create a file first 
			// and call this function again to try writting again
			createAndWrite (filepath, result, function(err){
				if (err)
					return console.log(err);
				// no error, indicate that write complete
				console.log (format + ": File Write Complete");
			});
			
		}
	}
}

module.exports = ESLintCLIHelper;