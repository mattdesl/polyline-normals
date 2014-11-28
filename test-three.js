require('domready')(run)

var THREE = require('three')
var OrbitViewer = require('three-orbit-viewer')(THREE)
var Complex = require('three-simplicial-complex')(THREE)
var Line = require('./three-line-2d')(THREE)
var normalize = require('normalize-path-scale')

var normals = require('./')

var arc = require('arc-to')
var curve = require('adaptive-bezier-curve')

// var path = normalize([ [40, 40], [80, 30], [80, 60], [125, 33], [115, 100], [50, 120], [70, 150] ])
// var path = normalize(arc(100, 100, 25, 0, Math.PI*2, false, 60))
var path = normalize(curve([40, 40], [70, 100], [120, 20], [200, 40], 5))
// var path = normalize(curve([40, 40], [40, 100], [100, 100], [100, 40], 12))
// var path = [ [0, 0], [6, 0] ]

function run() {
    var app = OrbitViewer({
        clearColor: 0x000000,
        clearAlpha: 1.0,
        fov: 65,
        position: new THREE.Vector3(1, 1, -2),
        contextAttributes: {
            antialias: false
        }
    })



    var geometry = Line(path, { distances: true })

    var mat = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        // wireframe: true,
        uniforms: {
            time:  { type: 'f', value: 0 },
            thickness: { type: "f", value: 0.1 }
        },
        attributes: {
            lineMiter:  { type: 'f', value: 0 },
            lineDistance: { type: 'f', value: 0 },
            lineNormal: { type: 'v2', value: new THREE.Vector2() }
        },
        vertexShader: [
            "uniform float thickness;",
            "attribute float lineMiter;",
            "attribute vec2 lineNormal;",
            "attribute float lineDistance;",
            "varying float edge;",
            "varying float smooth;",
            "varying float lineU;",
            "uniform float time;",

            "void main() {",
                "edge = sign(lineMiter);",
                "smooth = thickness / 100.0;",
                "lineU = lineDistance;",
                "vec3 pointPos = position.xyz + vec3(lineNormal * thickness/2.0 * lineMiter, 1.0);",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( pointPos, 1.0 );",
            "}"
        ].join("\n"),
        fragmentShader: [   
            "varying float edge;",
            "varying float smooth;",
            "varying float lineU;",

            "void main() {",
                //line smooth
                "float center = 1.0 - abs(edge);",
                "center = smoothstep(0.5 - smooth, 0.5 + smooth, center);",
                
                "float lineV = edge/2.0+0.5;",
                "float stp = 6.0;",
                "float lineUMod = mod(lineU, 1.0/stp) * stp;",
                "vec2 lineUV = vec2(lineUMod, lineV) - 0.5;",
                "lineUV.y *= 2.0;",
                "float dash = length(lineUV);",
                "dash = smoothstep(0.5, 0.4, dash);",
                // "float dash = smoothstep(dashMid + dashOff, dashMid - 0.0, mod(stipple, dashAmt));",
                "gl_FragColor = vec4(vec3(1.0), 1.0);",
            "}"
        ].join("\n")
    })

    var mesh = new THREE.Mesh(geometry, mat)
    app.scene.add(mesh)

    var time = 0
    app.on('tick', function(dt) {
        time += dt/1000
        mat.uniforms.time.value = time*0.2
    })
}
