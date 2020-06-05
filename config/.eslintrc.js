// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  extends: 
   [
    "plugin:vue-libs/recommended"
  ],
  // required to lint *.vue files
  plugins: [
    'html','vue-libs'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.test.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
   
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-plusplus': 0,
    'no-shadow': 0,
    'no-param-reassign': 0
  }
}