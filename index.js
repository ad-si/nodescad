var fs = require('fs'),
	path = require('path'),
	childProcess = require('child_process'),

	jsonSchemaDefaults = require('json-schema-defaults'),
	yaml = require('js-yaml'),
	clone = require('clone'),
	temp = require('temp'),
	tv4 = require('tv4'),

	configSchema = yaml.safeLoad(
		fs.readFileSync(path.join(__dirname, 'configSchema.yaml'))
	),
	nodescad = {}


function applyDefaults (options, defaults) {

	var key

	options = options || {}

	for (key in defaults)
		if (defaults.hasOwnProperty(key) &&
			typeof options[key] === 'undefined')
			options[key] = defaults[key]

	return options
}

function render (options, callback) {

	var validationResult,
		projectionsMap = {
			orthogonal: 'o',
			perspective: 'p'
		},
		cameraCommand = '',
		variablesCommand = '',
		shellCommand,
		outputFile,
		key


	options = applyDefaults(options, jsonSchemaDefaults(clone(configSchema)))


	validationResult = tv4.validateResult(options, configSchema, null)

	if (!validationResult.valid) {
		return callback(new Error(
			validationResult.error.message +
			' for ' + validationResult.error.dataPath
		))
	}

	outputFile = options.outputFile || temp.path({suffix: '.' + options.format})

	if (options.camera.type === 'gimbal') {
		cameraCommand = '--camera=' + [
			options.camera.translate.x,
			options.camera.translate.y,
			options.camera.translate.z,
			options.camera.rotate.x,
			options.camera.rotate.y,
			options.camera.rotate.z,
			options.camera.distance
		].join()
	}
	else if (options.camera.type === 'vector') {
		cameraCommand = '--camera=' + [
			options.camera.eye.x,
			options.camera.eye.y,
			options.camera.eye.z,
			options.camera.center.x,
			options.camera.center.y,
			options.camera.center.z
		].join()
	}

	// Stringify cli variables
	if (options.variables !== {})
		for (key in options.variables)
			if (options.variables.hasOwnProperty(key))
				variablesCommand += '-D ' +
					key + '=' + options.variables[key] + ' '


	shellCommand = [
		options.binaryPath,
		'-o',
		outputFile,
		options.dependenciesFile ? '-d ' + options.dependenciesFile : '',
		options.makeCommand ? '-m ' + options.makeCommand : '',
		variablesCommand,
		cameraCommand,
		'--imgsize=' + [options.imageSize.x, options.imageSize.y].join(),
		'--projection=' + projectionsMap[options.projection],
		options.render ? '--render' : '',
		'--preview=' + options.preview,
		options.csglimit ? '--csglimit=' + options.csglimit : '',
		options.inputFile
	]

	childProcess.exec(
		shellCommand.join(' '),
		function (error, stdout, stderr) {

			if (error) {
				callback(error)
				return
			}

			if (!options.outputFile)
				fs.readFile(outputFile, {}, function (error, data) {

					if (error) {
						callback(error)
						return
					}
					else
						callback(null, data)

					fs.unlink(outputFile, function (error) {
						if (error && error.code !== 'ENOENT')
							throw error
					})
				})

			else
				callback()
		}
	)
}


nodescad.render = render

nodescad.renderFile = function (inputFile, options, callback) {
	options.inputFile = inputFile
	render(options, callback)
}


module.exports = nodescad
