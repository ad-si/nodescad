# NodeSCAD

Node.js wrapper for OpenSCAD


## Installation

`$ npm install nodescad`


## Usage

```js
var nodescad = require('nodescad'),
	options = {
		binaryPath: '~/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD'
	    inputFile: 'path/to/file'
	    // For more options check out the configSchema.yaml file
	}


nodeScad.render(options, function (error, dataBuffer) {
    if (error)
        throw error
    
    console.log(dataBuffer.toString())
})
```
