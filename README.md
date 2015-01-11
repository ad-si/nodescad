# NodeSCAD

Node.js wrapper for OpenSCAD


## Installation

`$ npm install nodescad`


## Usage

```
var nodescad = require('nodescad'),
	options = {
	    inputFile: 'path/to/file'
	    // For more options check out the configSchema.yaml file
	}


nodeScad.render(options, function (error, dataBuffer) {
    if (error)
        console.error(error.message)
    else
        console.log(dataBuffer.toString('utf8'))
})
```
