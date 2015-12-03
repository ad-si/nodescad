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

let description1 = 'Render an OpenSCAD file with render()'
nodeScad.render(
	{
		binaryPath: binaryPath,
		inputFile: path.join(__dirname, 'cone.scad')
	},
	function (error, result) {

		process.stdout.write(description1)

		var expectedFileSize,
			actualFileSize

		assert(!error, '\n' + error)

		expectedFileSize = 55235
		actualFileSize = result.buffer.toString().length

		assert.equal(
			actualFileSize,
			expectedFileSize,
			'Stl file has wrong size. ' +
			'Expected ' + expectedFileSize +
			' but got ' + actualFileSize
		)
		console.log(' ✔︎')
	}
)


let description2 = 'Render an OpenSCAD file with renderFile()'
nodeScad.renderFile(
	path.join(__dirname, 'cone.scad'),
	{
		binaryPath: binaryPath
	},
	function (error, result) {

		process.stdout.write(description2)

		var expectedFileSize,
			actualFileSize

		assert(!error, '\n' + error)

		expectedFileSize = 55235
		actualFileSize = result.buffer.toString().length

		assert.equal(
			actualFileSize,
			expectedFileSize,
			'Stl file has wrong size. ' +
			'Expected ' + expectedFileSize +
			' but got ' + actualFileSize
		)
		console.log(' ✔︎')
	}
)


let description3 = 'Override parameters'
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

		process.stdout.write(description3)

		var expectedFileSize,
			actualFileSize

		assert(!error, '\n' + error)

		expectedFileSize = 66100
		actualFileSize = result.buffer.toString().length

		assert.equal(
			actualFileSize,
			expectedFileSize,
			'Stl file has wrong size. ' +
			'Expected ' + expectedFileSize +
			' but got ' + actualFileSize
		)
		console.log(' ✔︎')
	}
)


let description4 = 'Pass input file as a string'
nodeScad.render(
	{
		input: 'cube([2,3,4]);',
		binaryPath: binaryPath
	},
	function (error, result) {

		process.stdout.write(description4)

		var expectedFileSize,
			actualFileSize

		assert(!error, '\n' + error)

		expectedFileSize = 1437
		actualFileSize = result.buffer.toString().length

		assert.equal(
			actualFileSize,
			expectedFileSize,
			'Stl file has wrong size. ' +
			'Expected ' + expectedFileSize +
			' but got ' + actualFileSize
		)
		console.log(' ✔︎')
	}
)
