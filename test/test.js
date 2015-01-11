var nodeScad = require('../index.js'),
	path = require('path')


nodeScad.renderFile(
	{
		inputFile: path.join(__dirname, 'cone.scad')
	},
	function (error, data) {
		if (error)
			console.error(error.message)
		else
			console.log(data.toString('utf8'))
	}
)

