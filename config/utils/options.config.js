// default values
var reportsPathsDefaults = require ('./defaults/reportsPaths.defaults');
var eslintDefaults = require ('./defaults/eslint.defaults');
var karmaDefaults = require ('./defaults/karma.defaults');
var jenkinsDefaults = require ('./defaults/jenkins.defaults');
var userDefaults = require ('./defaults/user.defaults');
var e2eDefaults = require('./defaults/e2e.defaults');

var preprocess_paths = require ('./helpers/Config.helper').preprocess_paths;
var merge = require ('./helpers/Util.helper').merge;

// load user's definition of project config
var projectConfig = userDefaults;
var filepath = (process.env.DEVELOPMENT) ? '../../project.dev.config' : '../../project.config'
try {
	projectConfig =  require(filepath);
} catch (e) {
	console.log(e);
}

// merge with defaults
var reportsPaths = preprocess_paths(merge(reportsPathsDefaults, projectConfig.reportsPaths));
var eslint = merge(eslintDefaults, projectConfig.eslint);
var karma = merge(karmaDefaults.preprocess(karmaDefaults, reportsPaths), projectConfig.karma);
var e2e = e2eDefaults.preprocess(merge(e2eDefaults, projectConfig.e2e), eslint.pathToApp, reportsPaths);


// except for this
// either its the user input or null
var jenkins = merge(jenkinsDefaults, projectConfig.jenkins);

// exports 
module.exports.userDefaults = userDefaults;
module.exports.projectTitle = (projectConfig.projectTitle == null) ? "" : projectConfig.projectTitle;
module.exports.reportsPaths = reportsPaths;
module.exports.eslint = eslint;
module.exports.karma = karma;
module.exports.jenkins = jenkins;
module.exports.e2e = e2e;
