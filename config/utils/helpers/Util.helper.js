// PRE: obj given with pre being things to be
//		printed for each level, brought forward to next level
// POST: object printed orderly
module.exports.PrettyObjectPrinter = require ("./classes/PrettyObjectPrinter/PrettyObjectPrinter");
module.exports.merge = function (original, newer) {

	for (var key in newer) {
		if (original[key] == null) {
			// if original didn't have the key, add it
			original[key] = newer[key];
		} else if (typeof original[key] != typeof newer[key]) {
			// conflicting data type
			console.log (key + ": Change in datatype not allowed");
		} else if (Array.isArray(original[key])) {
			// If it is an array
			// merge uniquely
			uniqueMerge(original[key], newer[key]);
		} else if (typeof original[key] == 'object') {
			// If it is an object 
			// merge recursively
			module.exports.merge (original[key], newer[key]);
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
		// for every item from arrFrom
		for (var i = 0; i < arrFrom.length; i++) {
			// a flag to see if element 
			// from arrFrom should be added to arrTo
			var toAdd = true;
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
	
	for (var i = 0; i < keys.length; i++) {
		if (value[keys[i]] == undefined) {
			return value[keys[i]];
		}

		value = value[keys[i]];
	}
	return value;
}

module.exports.setValueByKeys = function (obj, keys, newValue) {
	var value = obj;
	for (var i = 0; i < keys.length; i++) {
		if (value[keys[i]] == undefined) {
			value[keys[i]] = newValue
			return obj;
		}

		if (i == keys.length - 1) {
			value[keys[i]] = newValue
			return obj;
		}
		value = value[keys[i]];
	}
	return obj;
}