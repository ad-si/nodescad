'use strict'

var nodeScad = require('../index.js'),
	path = require('path'),
	assert = require('assert'),
	fs = require('fs'),
	binaryPath,
	possibleBinaryPaths,
	i


possibleBinaryPaths = [
	path.join(
		process.env.HOME,
		'Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD'
	),
	'/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD'
]

// Find our OpenSCAD path
for (i = 0; i < possibleBinaryPaths.length; i++) {
	if (fs.existsSync(possibleBinaryPaths[i])) {
		binaryPath = possibleBinaryPaths[i]
		break
	}
}


nodeScad.render(
	{
		binaryPath: binaryPath,
		inputFile: path.join(__dirname, 'cone.scad')
	},
	function (error, result) {

		var expectedFileSize,
			actualFileSize

		if (error)
			throw error

		expectedFileSize = 55235
		actualFileSize = result.buffer.toString().length

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
	function (error, result) {

		var expectedFileSize,
			actualFileSize

		if (error)
			throw error

		expectedFileSize = 55235
		actualFileSize = result.buffer.toString().length

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
	function (error, result) {

		var expectedFileSize,
			actualFileSize

		if (error)
			throw error

		expectedFileSize = 66100
		actualFileSize = result.buffer.toString().length

		assert.equal(
			actualFileSize,
			expectedFileSize,
			'Stl file has wrong size. ' +
			'Expected ' + expectedFileSize +
			' but got ' + actualFileSize
		)
	}
)
