var nodeScad = require('../index.js'),
	path = require('path'),
	assert = require('assert')


nodeScad.render(
	{
		inputFile: path.join(__dirname, 'cone.scad')
	},
	function (error, bufferData) {
		if (error)
			console.error(error.message)
		else
			assert.equal(
				bufferData.toString('utf8').length,
				603433,
				'Stl file has wrong size'
			)
	}
)

nodeScad.renderFile(
	path.join(__dirname, 'cone.scad'),
	{},
	function (error, bufferData) {
		if (error)
			console.error(error.message)
		else
			assert.equal(
				bufferData.toString('utf8').length,
				60343,
				'Stl file has wrong size'
			)
	}
)
