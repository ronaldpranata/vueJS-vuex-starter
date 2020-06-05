module.exports = {
   projectTitle: "VueJS-kickoff",
   karma: {

   },
   eslint: {
   },
   reportsPaths: {
      eslint: {
        base: '../test/reports'
      },
      reportsPaths: {
        base: '../test/reports'
      },
      karma: {
        base: '../test/reports'
      }
   },
   jenkins: {
      rocketchatChannel: "all-tests",
      email: "ronald.pranata@isobar.com"
   },
   e2e: {
      browsers: [
          "chrome"
      ],
      run: false,
      browserstack: {

      }
   }
}