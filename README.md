# polyline-normals

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

![img](http://i.imgur.com/UP2Fq12.png)

Computes the normals of a polyline, using miter joins where multiple segments meet.  This is mainly useful to expand thick lines in a vertex shader on the GPU. 

```js
var getNormals = require('polyline-normals')

//a triangle
var path = [ [0, 122], [0, 190], [90, 190] ]

//get the normals as a closed loop
var normals = getNormals(path, true)

//now draw our thick line in 2D/3D/etc
```

See [the 2d test](test-2d.js) for an example of how these lines would be extruded. 

For more complex line joins and end caps, see [extrude-polyline](https://nodei.co/npm/extrude-polyline/) (which builds an indexed mesh). 

## Shader Example

For an example of how to use this within a shader, see [three-line-2d](https://nodei.co/npm/three-line-2d/).

## Usage

[![NPM](https://nodei.co/npm/polyline-normals.png)](https://nodei.co/npm/polyline-normals/)

#### `normals(path[, closed])`

For the given path, produces a new array of the same length with normal information for each point. The data contains a normal, `[nx, ny]` and the length of the miter (default to 1.0 where no join occurs). 

```js
[ 
    [ [nx, ny], miterLength ],
    [ [nx, ny], miterLength ]
]
```

If `closed` is true, it assumes a segment will be drawn from the last point to the first point, and adjusts those normals accordingly.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/polyline-normals/blob/master/LICENSE.md) for details.
