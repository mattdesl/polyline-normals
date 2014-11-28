require('canvas-testbed')(render, { once: true })

var vec = require('gl-vec2')

var getNormals = require('./')
var arc = require('arc-to')
var curve = require('adaptive-bezier-curve')

var paths = []
paths.push( [ [40, 40], [80, 30], [80, 60], [125, 33], [115, 100], [50, 120], [70, 150] ] )
paths.push( { path: circle(130, 120, 25), closed: true } )
paths.push( curve([40, 40], [70, 100], [120, 20], [200, 40], 5) )
paths.push( { path: [ [0, 122], [0, 190], [90, 190] ], closed: true } )
paths.push( { path: [ [50, 50], [100, 50], [100, 100], [50, 100] ], closed: true } )
paths.push( [ [30, -60], [80, 10] ] )

function circle(x, y, radius) {
    //in this case arc-to closes itself by making the 
    //last point equal to the first. we want to fix this
    //to pass in a more typical polyline and get the right normals
    var c = arc(x, y, radius, 0, Math.PI*2, false)
    c.pop()
    return c
}

function render(ctx, width, height) {
    ctx.clearRect(0,0,width,height)

    //draw each path with a bit of an offset
    ctx.save()
    paths.forEach(function(data, i) {
        var path = Array.isArray(data) ? data : data.path
        var closed = typeof data === 'object' && data.closed

        var cols = 3
        var x = i % cols,
            y = ~~(i / cols)
        ctx.translate(x * 50, y * 50)
        draw(ctx, path, closed)
    })
    ctx.restore()
}

function draw(ctx, path, closed) {
    var thick = 25,
        halfThick = thick / 2
    var psize = 4
    var tmp = [0,0]

    var top = []
    var bot = []

    //get the normals of the path
    var normals = getNormals(path, closed)
        
    //for drawing the join, we can just add the first point
    if (closed) {
        path.push(path[0])
        normals.push(normals[0])
    }

    //draw our expanded vertices for each point in the path
    ctx.globalAlpha = 0.15
    path.forEach(function(p, i) {
        var attrib = normals[i]
        var norm = attrib[0]
        var len = attrib[1]

        ctx.fillStyle = 'black'
        ctx.fillRect(p[0]-psize/2, p[1]-psize/2, psize, psize)

        ctx.beginPath()
        vec.scaleAndAdd(tmp, p, norm, len*halfThick)
        ctx.moveTo(p[0], p[1])
        ctx.lineTo(tmp[0], tmp[1])
        top.push(tmp.slice())

        vec.scaleAndAdd(tmp, p, norm, -len*halfThick)
        ctx.moveTo(p[0], p[1])
        ctx.lineTo(tmp[0], tmp[1])
        ctx.stroke()
        bot.push(tmp.slice())
    })

    //edges
    ctx.globalAlpha = 1
    ctx.beginPath()
    top.forEach(function(t) {
        ctx.lineTo(t[0], t[1])
    })
    ctx.stroke()

    ctx.beginPath()
    bot.forEach(function(t) {
        ctx.lineTo(t[0], t[1])
    })
    ctx.stroke()
}