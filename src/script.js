import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const count = 10
// Geometry
// const geometry = new THREE.SphereBufferGeometry(1, 100, 100)
const geometry = new THREE.PlaneGeometry(1, 1, count, count)

// Material
const material = new THREE.MeshPhongMaterial({
  // color: new THREE.Color(0xff00ff)
  side: THREE.DoubleSide
})

// const colors = new Float32Array(count * 3)

// for (let i = 0; i < count; i++) {
//   const i3 = i * 3

//   const testColor = new THREE.Color(0xffff00)
//   colors[i3] = testColor.r
//   colors[i3 + 1] = testColor.g
//   colors[i3 + 2] = testColor.b
// }

// geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const customUniforms = {
  uTime: { value: 0 },
  uRandomValue: { value: Math.random() }
}

material.onBeforeCompile = shader => {
  // console.log(shader)
  shader.uniforms.uTime = customUniforms.uTime
  shader.uniforms.uRandomValue = customUniforms.uRandomValue

  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
            #include <common>

            uniform float uTime;
            uniform float uRandomValue;
            varying vec2 vUv;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }

        `
  )

  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
        #include <begin_vertex>

        float angle = (position.y + uTime) * 0.5;
        mat2 rotationMatrix = get2dRotateMatrix(angle);

        vUv = uv;

        //transformed.xz = rotationMatrix * transformed.xz;
    `
  )

  // Fragment Shader

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>
      uniform float uTime;
      varying vec2 vUv;
            
      float random (vec2 _st) {
        return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
        `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <normal_fragment_begin>',
    `
            #include <normal_fragment_begin>
            
            float a = random(vec2(vUv.x, 1.0));
            
            //normal = normalize(vNormal);

            normal = normalize(vec3(vUv.x, vUv.y, vNormal.z));

            diffuseColor.rgb = vec3(normal);


        `
  )
}

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
scene.add(ambientLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

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
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(0, 0, 4)
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
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFShadowMap
// renderer.physicallyCorrectLights = true
// renderer.outputEncoding = THREE.sRGBEncoding
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 1
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

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
