var nodeScad = require('../index.js'),
	path = require('path'),
	assert = require('assert'),
	os = require('os'),
	fs = require('fs'),
	binaryPath = null

var possibleBinaryPaths = [
	'~/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD',
	'/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD'
	// Running on windows or Linux? What's a good path?
]

// Find our OpenSCAD path
for (var i in possibleBinaryPaths) {
	if ( fs.existsSync( possibleBinaryPaths[i] ) ) {
		binaryPath = possibleBinaryPaths[i];
		break;
	}
}

nodeScad.render(
	{
		binaryPath: binaryPath,
		inputFile: path.join(__dirname, 'cone.scad')
	},
	function (error, bufferData) {

		var expectedFileSize,
			actualFileSize

		if (error)
			throw error

		expectedFileSize = 55235
		actualFileSize = bufferData.toString().length

		assert.equal(
			actualFileSize,
			expectedFileSize,
			'Stl file has wrong size. ' +
			'Expected ' + expectedFileSize +
			' but got ' + actualFileSize
		)
	}
)

nodeScad.renderFile(
	path.join(__dirname, 'cone.scad'),
	{
		binaryPath: binaryPath
	},
	function (error, bufferData) {

		var expectedFileSize,
			actualFileSize

		if (error)
			throw error

		expectedFileSize = 55235
		actualFileSize = bufferData.toString().length

		assert.equal(
			actualFileSize,
			expectedFileSize,
			'Stl file has wrong size. ' +
			'Expected ' + expectedFileSize +
			' but got ' + actualFileSize
		)
	}
)

// Test for overridable paramters
nodeScad.renderFile(
	path.join(__dirname, 'cone.scad'),
	{
		binaryPath: binaryPath,
		variables: {
			height: 70,
			anotherParamter: 10
		}
	},
	function (error, bufferData) {

		var expectedFileSize,
			actualFileSize

		if (error)
			throw error

		expectedFileSize = 66100
		actualFileSize = bufferData.toString().length

		assert.equal(
			actualFileSize,
			expectedFileSize,
			'Stl file has wrong size. ' +
			'Expected ' + expectedFileSize +
			' but got ' + actualFileSize
		)
	}
)
