var vec = require('./vecutil')

var lineA = [0, 0]
var lineB = [0, 0]
var tangent = [0, 0]
var miter = [0, 0]

var util = require('polyline-miter-util')

module.exports = function(points) {
    var total = points.length

    var curNormal = null
    var out = []

    for (var i=1; i<total; i++) {
        var last = points[i-1]
        var cur = points[i]
        var next = i<points.length-1 ? points[i+1] : null

        util.direction(lineA, cur, last)
        if (!curNormal)  {
            curNormal = [0, 0]
            util.normal(curNormal, lineA)
        }

        if (i === 1) //add initial normals
            addNext(out, curNormal, 1)

        if (!next) { //no miter, simple segment
            util.normal(curNormal, lineA) //reset normal
            addNext(out, curNormal, 1)
        } else { //miter with last
            //get unit dir of next line
            util.direction(lineB, next, cur)

            //stores tangent & miter
            var miterLen = util.computeMiter(tangent, miter, lineA, lineB, 1)

            //get orientation
            var flip = (vec.dot(tangent, curNormal) < 0) ? -1 : 1

            addNext(out, miter, miterLen)
        }
    }
    return out
}

function addNext(out, normal, length) {
    out.push([[normal[0], normal[1]], length])
}