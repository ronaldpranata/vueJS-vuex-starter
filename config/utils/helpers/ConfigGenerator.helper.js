var ConfigGenerator = {}

/*
GIT RELATED FUNCTIONS
*/
// the functions that deals with the user's input
ConfigGenerator.gitConfigHandler = function (msg) {
	if (!process.env.DEVELOPMENT && msg.length > 0) {
		ConfigGenerator.removeGitFolder ();
		if (ConfigGenerator.isValidGitRepo(msg))
			ConfigGenerator.setGitRemoteURL (msg);
	}	
}

ConfigGenerator.removeGitFolder = function () {
	var removeDir = require ("./FileSystem.helper").deepRemoveDir;
	removeDir ('./.git', function () {
		console.log ("Git folder removed\n");
	});
}

// git init first and 
// followed by remote add origin
ConfigGenerator.setGitRemoteURL = function (url) {
	var exec = require ("child_process").exec;
	exec ("git init && " +
		  "git remote add origin " + url, function (error, stdout, stderr) {
		if (!error) {
			console.log ("set git remote url to: " + url + "\n");
		} else {
			console.log (stderr);
		}
	});
}

ConfigGenerator.isValidGitRepo = function (url) {
	return url.length > 0
}

module.exports = ConfigGenerator;