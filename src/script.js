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

// Geometry

// const geometry = new THREE.SphereBufferGeometry(1, 100, 100)
// const geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100)
// const geometry = new THREE.BufferGeometry()

const triangles = 1600

const geometry = new THREE.BufferGeometry()

const positions = []
const normals = []
const colors = []

const color = new THREE.Color()

const n = 80,
  n2 = n / 2 // triangles spread in the cube
const d = 12,
  d2 = d / 2 // individual triangle size

const pA = new THREE.Vector3()
const pB = new THREE.Vector3()
const pC = new THREE.Vector3()

const cb = new THREE.Vector3()
const ab = new THREE.Vector3()

for (let i = 0; i < triangles; i++) {
  // positions

  const x = Math.random() * n - n2
  const y = Math.random() * n - n2
  const z = Math.random() * n - n2

  const ax = x + Math.random() * d - d2
  const ay = y + Math.random() * d - d2
  const az = z + Math.random() * d - d2

  const bx = x + Math.random() * d - d2
  const by = y + Math.random() * d - d2
  const bz = z + Math.random() * d - d2

  const cx = x + Math.random() * d - d2
  const cy = y + Math.random() * d - d2
  const cz = z + Math.random() * d - d2

  positions.push(ax, ay, az)
  positions.push(bx, by, bz)
  positions.push(cx, cy, cz)

  // flat face normals

  pA.set(ax, ay, az)
  pB.set(bx, by, bz)
  pC.set(cx, cy, cz)

  cb.subVectors(pC, pB)
  ab.subVectors(pA, pB)
  cb.cross(ab)

  cb.normalize()

  const nx = cb.x
  const ny = cb.y
  const nz = cb.z

  normals.push(nx, ny, nz)
  normals.push(nx, ny, nz)
  normals.push(nx, ny, nz)

  // colors

  const vx = x / n + 0.5
  const vy = y / n + 0.5
  const vz = z / n + 0.5

  color.setRGB(vx, vy, vz)

  const alpha = Math.random()

  colors.push(color.r, color.g, color.b, alpha)
  colors.push(color.r, color.g, color.b, alpha)
  colors.push(color.r, color.g, color.b, alpha)
}

function disposeArray () {
  this.array = null
}

geometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(positions, 3).onUpload(disposeArray)
)
geometry.setAttribute(
  'normal',
  new THREE.Float32BufferAttribute(normals, 3).onUpload(disposeArray)
)
geometry.setAttribute(
  'color',
  new THREE.Float32BufferAttribute(colors, 4).onUpload(disposeArray)
)

// Material
const material = new THREE.MeshPhongMaterial({
  transparent: true,
  shininess: 250,
  vertexColors: true,
  side: THREE.DoubleSide
})

const customUniforms = {
  uTime: { value: 0 },
  uRandomValue: { value: Math.random() }
}

material.onBeforeCompile = shader => {
  shader.uniforms.uTime = customUniforms.uTime
  shader.uniforms.uRandomValue = customUniforms.uRandomValue

  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
            #include <common>

            uniform float uTime;
            uniform float uRandomValue;
            varying vec2 vUv;
            varying vec3 vPosition;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }

            float random (vec2 _st) {
              return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            vec3 rotateVectorByQuaternion(vec3 v, vec4 q){
              return 2.0 * cross(q.xyz, v * q.w + cross(q.xyz, v)) + v;
            }

        `
  )

  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
        #include <begin_vertex>
        vUv = uv;
        
        float angle = 0.9;

         
      //    vec2 rotation = vec2(position.x,0.1);

      //    vec4 direction = vec4(0.0, rotation.x, 0.0, rotation.y);
      //    vNormal = rotateVectorByQuaternion(vNormal, direction);

      //   mat2 rotationMatrix = get2dRotateMatrix(angle);

      vec4 offset = vec4(position.x,position.y,position.z, 1.0);
      float dist = sin(uTime) * 0.5 + 0.5;
      offset.xyz += normal * dist;

      // offset.xyz += normal * dist * sin(uTime);

     transformed.xy = offset.xy;

    `
  )

  // Fragment Shader

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vPosition;

      mat2 get2dRotateMatrix(float _angle)
      {
          return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
      }

      float random (vec2 _st) {
        return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
        `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <normal_fragment_begin>',
    `
      #include <normal_fragment_begin>

      //float angle = 0.3;
      vec3 offset = vec3(vPosition.x,vPosition.y,vPosition.z);

    //  normal = vec3(normal.x,normal.y,normal.z);

      // mat2 rotationMatrix = get2dRotateMatrix(angle);
      // offset.xz = vec2(vPosition.x, vPosition.z) * rotationMatrix;

      diffuseColor.rgb = vec3(normal);

//        diffuseColor.rgb = vec3(
//         diffuseColor.r,
//         diffuseColor.g, 
//         diffuseColor.b 
// );


        `
  )
}

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

scene.add(new THREE.AmbientLight(0x444444))

const light1 = new THREE.DirectionalLight(0xffffff, 0.5)
light1.position.set(1, 1, 1)
scene.add(light1)

const light2 = new THREE.DirectionalLight(0xffffff, 1.5)
light2.position.set(0, -1, 0)
scene.add(light2)

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
const camera = new THREE.PerspectiveCamera(
  27,
  window.innerWidth / window.innerHeight,
  1,
  3500
)
camera.position.z = 275

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

  // mesh.rotation.x = elapsedTime * 0.05
  // mesh.rotation.y = elapsedTime * 0.05

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
