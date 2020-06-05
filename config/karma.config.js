// Karma configuration
// Generated on Wed May 17 2017 15:18:10 GMT+0800 (Malay Peninsula Standard Time)
var options = require('./utils/options.config');
// karma's
var karmaOptions = options.karma;

module.exports = function(config) {
    
    var karma = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: karmaOptions.base,


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
         frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],


        // list of files / patterns to load in the browser
        files: [
            karmaOptions.files
        ],


        // list of files to exclude
        exclude: [ ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            //extended with variable at the bottom
        },

        //webpack config file
        webpack: require(karmaOptions.webpack),


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: karmaOptions.reporters,


        // web server port
        port: karmaOptions.port,


        // DEFAULTS
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,
        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,


        //IRRELEVANT 
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
    }

    // set preprocessors 
    karma.preprocessors[karmaOptions.files] = karmaOptions.filePreprocessor;

    // set reporters options
    karmaOptions.loadReporterOptions(karma, karmaOptions);
    config.set(karma);
}
