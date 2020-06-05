var FileSystemHelper = {}

FileSystemHelper.writeObjectToFile = function (filename, obj, callback, formatter = FileSystemHelper.formatter) {
	FileSystemHelper.deepCreateAndWrite (filename, formatter(obj), callback);
}

FileSystemHelper.formatter = function (obj) {
	var PrettyObjectPrinter = require ("./classes/PrettyObjectPrinter/PrettyObjectPrinter");
	return "module.exports = " + PrettyObjectPrinter.print(obj);
}

// PRE: err is either null or contains error object
// POST: returns true if either there is no error or 
//		 if error says that directory exist
FileSystemHelper.dirExist =  function (err) {
	return FileSystemHelper.fileExist(err);
}

// PRE: err is either null or contains error object
// POST: returns true if either there is not error or 
//		 if error says that file exist
FileSystemHelper.fileExist = function (err) {
	return (!err || err.code != "ENOENT");
}

// PRE: a valid file path and a callback function to be executed upon successful reading
// POST: if no error, callback will be executed, else err will be logged
FileSystemHelper.readFile = function (file, callback) {
	// node's file system
	var fs = require('fs');
	fs.readFile(file, {encoding: 'utf-8'}, function(err,data){
		var response = {
			data: data,
			err: err,
			info: {
				filename: file
			}
		}
		callback(response);
	});
}

FileSystemHelper.readFileSync = function (file) {
	var fs = require ('fs');
	var result;
	try {
		result = fs.readFileSync (file)
	} catch (e) {
		return console.log (err);
	} 

	return result;
}

FileSystemHelper.deepCreateAndWrite = function (filename, values = "", callback, dir = './', err) {
	var path = require ("path");
	if (typeof filename == "string") {
		filename = filename.replace(/\\/g, "/").split("/");
	}
	if (filename.length < 1) {
		return "INVALID FILENAME";
	} 
	if (filename.length == 1) {
		if (filename[0].trim().length > 0)
			FileSystemHelper.createAndWrite (dir + filename, values, callback);
		else 
			callback(err);
	} else if (filename[0].trim().length == 0) {
		filename.shift();
		FileSystemHelper.deepCreateAndWrite (filename, values, callback, dir + '/');
	} else {
		var fs = require ('fs');
		dir = path.join(dir, filename[0].trim());

		try {
			fs.mkdirSync (dir)
		} catch (err) {
			if (!FileSystemHelper.dirExist(err)) 
				return console.log(err);
		} finally {
			filename.shift();
			FileSystemHelper.deepCreateAndWrite (filename, values, callback, dir + '/', err);
		}
	}
}

FileSystemHelper.createAndWrite = function (filename, values, callback) {
	var fs = require('fs');
	var err;
	try {
		var fd = fs.openSync (filename, 'w');
		fs.writeFileSync (filename, values);
		fs.closeSync(fd);
	} catch (e) {
		err = e;
	} finally {
		callback(err);
	}
}

// PRE: data is a xml string
// POST: XML Object returned
FileSystemHelper.parseXML = function (data) {
	var DOMParser = require("xmldom").DOMParser;
	try {
		var doc = new DOMParser().parseFromString(data);
	} catch (e) {
		throw e;
		return;
	} finally {
		return doc;
	}
}

FileSystemHelper.deepRemoveDir = function (dir, callback = null) {
	var fs = require ("fs");
	var path = require ("path");

	try {
		var files = fs.readdirSync(dir);
	} catch (e) {
		if (!FileSystemHelper.dirExist(e)) {
			console.log ("Directory doesnt exist");
		} else {
			console.log (e);
		}
	} finally {
		if (files != null) {
			files.forEach (function (file, index){
				var filename = path.join(dir, file);
				if (fs.statSync(filename).isDirectory()) {
					FileSystemHelper.deepRemoveDir(filename)
				} else {
					fs.unlinkSync(filename);
				}
			});

			fs.rmdirSync (dir);
			if (callback != null) callback();
		}
	}
}

FileSystemHelper.isExtension = function (filename, extension) {
	extension = (extension.charAt(0) == ".") ? extension : "." + extension;
	var regex = new RegExp(".+"+extension+"$", "g");
	return filename.match(regex) != null;
}

FileSystemHelper.getAllFilesOfTypeInFolder = function (folder, type) {
	var fs = require ('fs');
	var path = require ('path');

	try {
		var contents = fs.readdirSync(folder);
	} catch (e) {
		if (!FileSystemHelper.dirExist(e)) {
			return [];
		} else {
			console.log (e);
		}
	} finally {
		var files = []
		if (contents != null) {
			contents.forEach (function (file, index){
				var filename = path.join(folder, file);
				if (fs.statSync(filename).isFile() &&
					FileSystemHelper.isExtension(filename, type)) {
					files.push(filename);
				}
			});
		}
		return files;
	}
}

module.exports = FileSystemHelper;