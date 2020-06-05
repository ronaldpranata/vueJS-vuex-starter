module.exports = {
	// paths are relative to package.json

	// String: path to app folder
	pathToApp: './src', 
	// String: path to files to be checked
	files: './src',
	"extends":  ["plugin:vue/essential", "airbnb-base"],
    "plugins": [
        "import","vue"
    ]
}