import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
//import typefaceData from '../fonts/pacifico/pacifico-regular-normal-400.json'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
let mouse = new THREE.Vector3(0, 0, 1)

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()
// const font = new THREE.FontLoader().parse(typefaceData)

let newMesh = null
let textGeometry = null

fontLoader.load('/fonts/pacifico/pacifico-regular-normal-400.json', font => {
  textGeometry = new THREE.TextGeometry('glitter', {
    font: font,
    size: 4.5,
    height: 0.2,
    curveSegments: 20,
    bevelEnabled: true,
    bevelThickness: 0.3,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 10
  })

  newMesh = addGlitterToText(textGeometry)
})

// Geometry

// const geometry = new THREE.SphereBufferGeometry(10, 100, 100)
// const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)

debugObject.glitterColor = '#7b0fdc'

const customUniforms = {
  uTime: { value: 0 },
  uRandomValue: { value: Math.random() },
  uGlitterSize: { value: 350.0 },
  uGlitterDensity: { value: 0.1 }
}

gui.addColor(debugObject, 'glitterColor').onChange(value => {
  debugObject.glitterColor = value.toString()
  const object = scene.getObjectByProperty('name', 'textMesh')

  object.geometry.dispose()
  object.material.dispose()
  scene.remove(object)

  newMesh = addGlitterToText(textGeometry)
})

gui
  .add(customUniforms.uGlitterSize, 'value')
  .min(50.0)
  .max(500.0)
  .step(10.0)
  .name('glitterSize')

gui
  .add(customUniforms.uGlitterDensity, 'value')
  .min(0.0)
  .max(1.0)
  .step(0.001)
  .name('glitterDensity')

//newMesh = addGlitterToText(geometry)

function addGlitterToText (geometry) {
  // Material
  const material = new THREE.MeshPhongMaterial({
    transparent: false,
    color: debugObject.glitterColor // #6a0dad
  })

  material.onBeforeCompile = shader => {
    shader.uniforms.uTime = customUniforms.uTime
    shader.uniforms.uRandomValue = customUniforms.uRandomValue
    shader.uniforms.uGlitterSize = customUniforms.uGlitterSize
    shader.uniforms.uGlitterDensity = customUniforms.uGlitterDensity

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
              #include <common>

              uniform float uTime;
              uniform float uRandomValue;
              uniform float uGlitterSize;
              uniform float uGlitterDensity;
              varying vec2 vUv;
              varying vec3 vPosition;


          `
    )

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
          #include <begin_vertex>
          vUv = uv;

      `
    )

    //   Fragment Shader

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
    // Created by Inigo Quilez - iq/2014
    // Modified by Leanne Werner - 2022

      #include <common>
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float uRandomValue;
      uniform float uGlitterSize;
      uniform float uGlitterDensity;
    

      vec3 hash3( vec2 p ){
          vec3 q = vec3( dot(p,vec2(127.1,311.7)),
                        dot(p,vec2(269.5,183.3)),
                        dot(p,vec2(419.2,371.9)) );
        return fract(sin(q)*43758.5453);
      }

      vec3 findSpecLight (vec3 vnormal, vec3 diffuseColor) {
         vec3 addedLights = vec3(0.0,0.0,0.0);
      
          vec3 pointLightPosition = vec3(vPosition) + vec3(.0,.0,1.0);
          vec3 pointLightColor = vec3(1.0, 1.0, 1.0);
          vec3 lightDirection = normalize(vPosition - pointLightPosition);
                  
          addedLights.rgb += clamp(dot(-lightDirection, vnormal), 0., .9) * pointLightColor;
          addedLights.rgb *= vec3(diffuseColor.rgb);

          return addedLights;
      }

      float iqnoise( in vec2 x, float u, float v, vec3 vnormal ) {
       
        vec2 p = floor(x);
        vec2 f = fract(x);

        float k = 1.0+63.0*pow(1.0-v,4.0);

        float va = 0.0;
        float wt = 0.0;
          for( int j=-2; j<=2; j++ )
          for( int i=-2; i<=2; i++ ) {
            vec2 g = vec2( float(i),float(j) );
            vec3 o = hash3( p + g ) ;
            vec2 r = g - f + o.xy;
            float d = dot(r,r);
            float ww = pow( 1.0-smoothstep(0.04,.140,sqrt(d)),  k );
            va += o.z*ww;
            wt += ww ;
          }

          return va / wt;
      }

      `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <normal_fragment_begin>',
      `
        #include <normal_fragment_begin>

         vec3 specLighting = findSpecLight(normal, diffuseColor.rgb);
         float f = iqnoise( uGlitterSize*(vUv.xy)*vec2(2,2), .1, 1.0, normal );
          
          vec3 c = vec3(f);
          vec3 col = mix( vec3(1.0), specLighting.rgb, smoothstep(0.25 + uGlitterDensity, .25, c.x ) );
          diffuseColor.rgb /= mix(vec3(col), vec3(c), vec3(0.0));
          `
    )
  }

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'textMesh'
  mesh.position.x = -8
  scene.add(mesh)
  return mesh
}

// Mesh
//const mesh = new THREE.Mesh(geometry, material)
//scene.add(mesh)

scene.add(new THREE.AmbientLight(0x444444, 2.6))

const light1 = new THREE.PointLight(0xffffff, 0.9)
light1.position.set(3, 30, 30)
scene.add(light1)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Mouse Move
function handleMouseMove (event) {
  mouse.x = (event.clientX / sizes.width) * 2 - 1
  mouse.y = -(event.clientY / sizes.height) * 2 + 1
  mouse.z = 1

  const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5)
  vector.unproject(camera)
  const dir = vector.sub(camera.position).normalize()
  const distance = -camera.position.z / dir.z
  const pos = camera.position.clone().add(dir.multiplyScalar(distance))

  light1.position.set(pos.x, pos.y, 10.0)
  mouse = pos
}

window.addEventListener('mousemove', handleMouseMove)

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  27,
  window.innerWidth / window.innerHeight,
  1,
  3500
)
camera.position.z = 60

scene.background = new THREE.Color('#a9ffff')
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update material
  customUniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  if (newMesh) {
    // newMesh.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2
    // newMesh.rotation.y = Math.sin(elapsedTime * 0.3) * 0.2
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
