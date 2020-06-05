// PRE: obj given with pre being things to be
//		printed for each level, brought forward to next level
// POST: object printed orderly
module.exports.printObject = function (resultObj, pre = "") {

	if (typeof resultObj != 'object') {
		// not an object, proceed to print
		console.log (pre + resultObj);
	} else {
		// go deep into the object
		for (var key in resultObj) {
			if (Array.isArray(resultObj[key])) {
				// object in the array will have the same pre
				console.log(pre + key + ":");
				for (var i = 0; i < resultObj[key].length; i++) {
					module.exports.printObject (resultObj[key][i], pre + "...");
				}
			} else if (typeof resultObj[key] == 'object') {
				console.log(pre + key + ":");
				// recursive call
				module.exports.printObject (resultObj[key], pre + "...");
			} else {
				// resultObj[key] is not an object, proceed to console.log
				console.log (pre + key + ": " + resultObj[key]);
			}
		}
	}

	if (pre == "")
		console.log();
}

module.exports.merge = function (original, newer) {
	for (var key in newer) {
		if (original[key] == null) {
			// if original didn't have the key, add it
			original[key] = newer[key];
		} else if (typeof original[key] != typeof newer[key]) {
			// conflicting data type
			console.log ("Change in datatype not allowed");
		} else if (Array.isArray(original[key])) {
			// If it is an array
			// merge uniquely
			uniqueMerge(original[key], newer[key]);
		} else if (typeof original[key] == 'object') {
			// If it is an object 
			// merge recursively
			module.exports.merge (newer[key], original[key])
		} else {
			// overwrite 
			original[key] = newer[key];
		}
	}

	// PRE: two array given, 
	//			arrTo: The one to inherit
	//			arrFrom: The one to be inherited
	// POST: arrTo is now merged and is unique
	function uniqueMerge(arrTo, arrFrom) {
		// a flag to see if element 
		// from arrFrom should be added to arrTo
		var toAdd = true;
		// for every item from arrFrom
		for (var i = 0; i < arrFrom.length; i++) {
			// check with every item from arrTo 
			// stops when same thing found, set toAdd flag to false
			for (var j = 0; j < arrTo.length; j++) {
				if (arrFrom[i] == arrTo[j]) {
					toAdd = false;
					break;
				}
			}

			// check and adds
			if (toAdd)
				arrTo.push(arrFrom[i]);
		}
	}

	return original;
}

module.exports.getValueByKeys = function (obj, keys) {
	var value = obj;
	keys.forEach(function(key, index){
		if (value[key] == null) {
			return value[key];
		}  
		value = value[key];
	});
	return value;
}

module.exports.setValueByKeys = function (obj, keys, newValue) {
	var value = obj;
	keys.forEach(function(key, index){
		if (value[key] == null) {
			return value[key];
		}  
		if (index == keys.length - 1) {
			value[key] = newValue
			return;
		}
		value = value[key];
	});
}

module.exports.ConfigHelper = require ("./Config.helper");
module.exports.ConfigGeneratorHelper = require ("./ConfigGenerator.helper");
module.exports.FileSystemHelper = require ("./FileSystem.helper");
module.exports.ESLintCLIHelper = require ("./EslintCLI.helper");
module.exports.RocketchatHelper = require ("./Rocketchat.helper");