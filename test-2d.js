require('canvas-testbed')(render, { once: true })

var vec = require('gl-vec2')

var getNormals = require('./')
var arc = require('arc-to')
var curve = require('adaptive-bezier-curve')

var paths = []
paths.push( [ [40, 40], [80, 30], [80, 60], [125, 33], [115, 100], [50, 120], [70, 150] ] )
paths.push( arc(130, 120, 25, 0, Math.PI*2, false) )
paths.push( curve([40, 40], [70, 100], [120, 20], [200, 40], 5) )
paths.push( [ [0, 122], [0, 190], [90, 190], [0, 122] ] )
paths.push( [ [50, 50], [100, 50], [100, 100], [50, 100], [50, 50] ] )
paths.push( [ [30, -60], [80, 10] ] )

function render(ctx, width, height) {
    ctx.clearRect(0,0,width,height)

    //draw each path with a bit of an offset
    ctx.save()
    paths.forEach(function(path, i) {
        var cols = 3
        var x = i % cols,
            y = ~~(i / cols)
        ctx.translate(x * 50, y * 50)
        draw(ctx, path)
    })
    ctx.restore()
}

function draw(ctx, path) {
    var thick = 25,
        halfThick = thick / 2
    var psize = 4
    var tmp = [0,0]

    var top = []
    var bot = []

    //get the normals of the path
    var normals = getNormals(path)

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