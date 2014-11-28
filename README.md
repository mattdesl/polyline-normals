# polyline-normals

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

![img](http://i.imgur.com/UP2Fq12.png)

Computes the normals of a polyline, using miter joins where multiple segments meet.  This is mainly useful to expand thick lines in a vertex shader on the GPU. 

```js
var getNormals = require('polyline-normals')

//a triangle, closed
var path = [ [0, 122], [0, 190], [90, 190], [0, 122] ]

//get the normals
var normals = getNormals(path)

//now draw our thick line in 2D/3D/etc
```

See [the 2d test](test-2d.js) for an example of how these lines would be extruded. 

For more complex line joins and end caps, see [extrude-polyline](https://nodei.co/npm/extrude-polyline/) (which builds an indexed mesh). 

## ThreeJS Example

Coming soon.

## Usage

[![NPM](https://nodei.co/npm/polyline-normals.png)](https://nodei.co/npm/polyline-normals/)

#### `normals(path)`

For the given path, produces a new array of the same length with normal information for each point. The data contains a normal, `[nx, ny]` and the length of the miter (default to 1.0 where no join occurs). 

```js
[ 
    [ [nx, ny], miterLength ],
    [ [nx, ny], miterLength ]
]
```

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/polyline-normals/blob/master/LICENSE.md) for details.
