# BINVOX

> Parser and builder for BINVOX voxel file format.

[![npm version](http://img.shields.io/npm/v/binvox.svg?style=flat)](https://npmjs.org/package/binvox "View this project on npm")
![Build](https://github.com/andstor/binvox/workflows/Build/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/andstor/binvox/badge.svg?branch=master)](https://coveralls.io/github/andstor/binvox?branch=master)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/andstor/binvox.svg?)](https://lgtm.com/projects/g/andstor/binvox/context:javascript)

Specification of vox file format can be found [here](https://www.patrickmin.com/binvox/binvox.html).

[Documentation](https://andstor.github.io/binvox/) - 
[Wiki](https://github.com/andstor/binvox/wiki)

## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [License](#license)

## Install

```console
$ npm install --save binvox
```

## Usage

### Syntax

```js
// Import via ES6 modules
import {Builder, Parser} from 'binvox';
// or UMD
const BINVOX = require('binvox');
```

###  Example
This Node.js example reads a BONVOX file and parses it:
```js
const fs = require('fs');
const BINVOX = require('binvox');
 
fs.readFile('path/to/file.binvox', (err, data) => {
  if (err) throw new Error(err);
  const parser = new BINVOX.Parser();
  const result = parser.parse(data.buffer);
  console.log(result);
})
```

where `data.buffer` is an instance of [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

It is recommended to read the official BINVOX [specification](https://www.patrickmin.com/binvox/binvox.html), in order to understand the structure of the data.

The output consists of various file information, in addition to the actual voxel data:
```js
{ 
  dimension: { depth: 32, width: 32, height: 32 },
  translate: { depth: 11.81, width: 21.39, height: -1.69 },
  scale: 30.206,
  voxels: [...]
}
```

`voxels` contain the actual voxel data (points), and looks like this:
```js
[
  { x: 0, y: 2, z: 3 },
  { x: 0, y: 3, z: 3 },
  { x: 0, y: 4, z: 3 },
  ...,
]
```
where the index of each voxel is ordered by the voxel's "location in space".

## API

### [`BINVOX.Parser`](https://andstor.github.io/binvox/Parser.html)
- [`constructor()`](https://andstor.github.io/binvox/Parser.html)
- [`parse(buffer): Object`](https://andstor.github.io/binvox/Parser.html#parse)

### [`BINVOX.Builder`](https://andstor.github.io/binvox/Builder.html)
- [`constructor()`](https://andstor.github.io/binvox/Builder.html)
- [`build(object): ArrayBuffer`](https://andstor.github.io/binvox/Builder.html#build)

## License

Copyright © 2020 [André Storhaug](https://github.com/andstor)

BINVOX is licensed under the [MIT License](https://github.com/andstor/binvox/blob/master/LICENSE).  
