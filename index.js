var fs = require('fs'),
	path = require('path'),
	childProcess = require('child_process'),
	os = require('os'),

	jsonSchemaDefaults = require('json-schema-defaults'),
	yaml = require('js-yaml'),
	clone = require('clone'),
	temp = require('temp'),
	tv4 = require('tv4'),

	configSchema = yaml.safeLoad(fs.readFileSync('./configSchema.yaml'))


function applyDefaults (options, defaults) {

	var key

	options = options || {}

	for (key in defaults)
		if (defaults.hasOwnProperty(key) &&
		    typeof options[key] === 'undefined')
			options[key] = defaults[key]

	return options
}


module.exports.renderFile = function (options, callback) {

	var validationResult = tv4.validateResult(options, configSchema, null, true),
		tempExportFile,
		shellCommand,
		binPath


	if (!validationResult.valid)
		return console.error(validationResult.error.message)

	options = applyDefaults(options, jsonSchemaDefaults(clone(configSchema)))


	tempExportFile = temp.path({suffix: '.' + options.format})


	if (os.platform() === 'darwin')
		binPath = '~/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD'
	else
		binPath = 'openscad'


	shellCommand = [
		binPath,
		'-o',
		tempExportFile,
		options.inputFile
	]

	childProcess.exec(
		shellCommand.join(' '),
		function (error, stdout, stderr) {

			if (error) {
				callback(error)
				return
			}

			fs.readFile(tempExportFile, {}, function (error, data) {

				if (error) {
					callback(error)
					return
				}
				else
					callback(null, data)

				fs.unlink(tempExportFile, function (error) {
					if (error && error.code !== 'ENOENT')
						throw error
				})
			})
		}
	)
}
