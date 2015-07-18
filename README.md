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


## Styleguide

The code in this repository is formatted as seen in [github.com/style-guides/JavaScript/tree/v0.1.1](https://github.com/style-guides/JavaScript/tree/v0.1.1)

In order to check whether the code complies to the styleguide, just execute `npm run prepublish`.
