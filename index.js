'use strict'

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

	options = options || {}

	for (let key in defaults)
		if (defaults.hasOwnProperty(key) &&
			typeof options[key] === 'undefined')
			options[key] = defaults[key]

	return options
}

function getCameraFlag (camera) {
	if (camera.type === 'gimbal') {
		return '--camera=' + [
			camera.translate.x,
			camera.translate.y,
			camera.translate.z,
			camera.rotate.x,
			camera.rotate.y,
			camera.rotate.z,
			camera.distance
		].join()
	}
	else if (camera.type === 'vector') {
		return '--camera=' + [
			camera.eye.x,
			camera.eye.y,
			camera.eye.z,
			camera.center.x,
			camera.center.y,
			camera.center.z
		].join()
	}
}

function createInputFile (options) {
	if (options.input) {
		let inputObject = temp.openSync()
		fs.writeSync(inputObject.fd, options.input)
		fs.closeSync(inputObject.fd)
		options.inputFile = inputObject.path
	}

	return options.inputFile
}

function stringifyCliVariables (options) {

	let variablesCommand = ''

	if (options.variables !== {})
		for (let key in options.variables)
			if (options.variables.hasOwnProperty(key))
				variablesCommand += `-D ${key}=${options.variables[key]} `

	return variablesCommand
}

function buildShellCommand (options) {

	let projectionsMap = {
		orthogonal: 'o',
		perspective: 'p'
	}

	return [
		options.binaryPath,
		'-o',
		options.outputFile || options.tempOutputFile,
		options.dependenciesFile ? '-d ' + options.dependenciesFile : '',
		options.makeCommand ? '-m ' + options.makeCommand : '',
		stringifyCliVariables(options),
		getCameraFlag(options.camera),
		'--imgsize=' + [options.imageSize.x, options.imageSize.y].join(),
		'--projection=' + projectionsMap[options.projection],
		options.render ? '--render' : '',
		'--preview=' + options.preview,
		options.csglimit ? '--csglimit=' + options.csglimit : '',
		createInputFile(options)
	].join(' ')
}

function render (options, callback) {

	options = applyDefaults(options, jsonSchemaDefaults(clone(configSchema)))

	let validationResult = tv4.validateResult(options, configSchema, null)

	if (!validationResult.valid) {
		return callback(new Error(
			validationResult.error.message +
			' for ' + validationResult.error.dataPath
		))
	}

	temp.track()

	if (!options.outputFile)
		options.tempOutputFile = temp.path({suffix: '.' + options.format})


	function renderCallback (error, stdout, stderr) {

		if (error) {
			callback(error)
			return
		}

		var returnObject = {
			stdout: stdout,
			stderr: stderr
		}

		if (!options.outputFile)
			fs.readFile(options.tempOutputFile, {}, function (error, data) {

				if (error) {
					callback(error)
					return
				}

				returnObject.buffer = data

				callback(null, returnObject)

				fs.unlink(options.tempOutputFile, function (error) {
					if (error && error.code !== 'ENOENT')
						throw error
				})
			})

		else
			callback(null, returnObject)
	}

	childProcess.exec(
		buildShellCommand(options),
		renderCallback
	)
}


nodescad.render = render

nodescad.renderFile = function (inputFile, options, callback) {
	options.inputFile = inputFile
	render(options, callback)
}


module.exports = nodescad
