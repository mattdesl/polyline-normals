require('canvas-testbed')(render, { once: true })

var vec = require('gl-vec2')

var getNormals = require('./')
var arc = require('arc-to')
var curve = require('adaptive-bezier-curve')

var paths = []
paths.push( [ [40, 40], [80, 30], [80, 60], [125, 33], [115, 100], [50, 120], [70, 150] ] )
paths.push( arc(100, 100, 25, 0, Math.PI*2, false) )
paths.push( curve([40, 40], [70, 100], [120, 20], [200, 40], 5) )

// TODO: support 'close'
// paths.push( [ [50, 50], [100, 50], [100, 100], [50, 100], [50, 50] ] )

function render(ctx, width, height) {
    ctx.clearRect(0,0,width,height)

    ctx.save()
    draw(ctx, paths[0])

    ctx.translate(150, 0)
    draw(ctx, paths[1], true)

    ctx.translate(200, 0)
    draw(ctx, paths[2])
    ctx.restore()
}

function draw(ctx, path, circle) {
    var thick = 25,
        halfThick = thick / 2
    var psize = 4
    var tmp = [0,0]

    var top = []
    var bot = []

    var normals = getNormals(path, true)

    //close the loop
    if (circle) {
        normals[0] = [[-1, 0], 1]
        normals[normals.length-1] = [[-1, 0], 1]
    }

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