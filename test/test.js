var nodeScad = require('../index.js'),
	path = require('path'),
	assert = require('assert'),
	os = require('os'),
	binaryPath = null


if (os.platform() === 'darwin')
	binaryPath = '~/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD'


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
