import { render } from 'react-dom'

import App from './App'

const rootElement = document.getElementById('root')
render(<App />, rootElement)

// import './style.css'
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GlitterMaterial } from './glitterMaterial'
// import * as dat from 'dat.gui'

// const gui = new dat.GUI()
// const debugObject = {}
// debugObject.glitterColor = '#dc630f'

// const canvas = document.querySelector('canvas.webgl')
// const scene = new THREE.Scene()
// let mouse = new THREE.Vector3(0, 0, 0)
// const meshes = []

// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight
// }

// /**
//  * Font
//  */
// const fontLoader = new THREE.FontLoader()

// let textMaterial = null

// const customUniforms = {
//   uGlitterSize: { value: 350.0 },
//   uGlitterDensity: { value: 0.1 }
// }

// fontLoader.load('/fonts/pacifico/pacifico-regular-normal-400.json', font => {
//   const textGeometry = new THREE.TextGeometry('glitter', {
//     font: font,
//     size: 5.5,
//     height: 0.2,
//     curveSegments: 20,
//     bevelEnabled: true,
//     bevelThickness: 1.2,
//     bevelSize: 0.01,
//     bevelOffset: 0,
//     bevelSegments: 10
//   })

//   textMaterial = new GlitterMaterial(customUniforms, {
//     color: '#dc630f'
//   })
//   const mesh = new THREE.Mesh(textGeometry, textMaterial)
//   mesh.name = 'textMesh'
//   mesh.position.x = -10

//   meshes.push(mesh)
//   scene.add(mesh)

//   createExamples()
//   // createConfigDemo()
// })

// function createExamples () {
//   const toursKnotExample = new THREE.Mesh(
//     new THREE.TorusKnotGeometry(10, 3, 100, 16),
//     new GlitterMaterial(customUniforms, {
//       color: '#dc0fc3'
//     })
//   )
// }

// scene.add(new THREE.AmbientLight(0x444444, 2.6))

// const light1 = new THREE.PointLight(0xffffff, 0.9)
// light1.position.set(3, 30, 30)
// scene.add(light1)

// // Mouse Move
// function handleMouseMove (event) {
//   mouse.x = (event.clientX / sizes.width) * 2 - 1
//   mouse.y = -(event.clientY / sizes.height) * 2 + 1
//   mouse.z = 1

//   const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5)
//   vector.unproject(camera)
//   const dir = vector.sub(camera.position).normalize()
//   const distance = -camera.position.z / dir.z
//   const pos = camera.position.clone().add(dir.multiplyScalar(distance))

//   light1.position.set(pos.x, pos.y, 10.0)
//   mouse = pos
// }

// window.addEventListener('mousemove', handleMouseMove)

// window.addEventListener('resize', () => {
//   sizes.width = window.innerWidth
//   sizes.height = window.innerHeight

//   camera.aspect = sizes.width / sizes.height
//   camera.updateProjectionMatrix()

//   renderer.setSize(sizes.width, sizes.height)
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })

// /**
//  * Camera
//  */
// const camera = new THREE.PerspectiveCamera(
//   27,
//   window.innerWidth / window.innerHeight,
//   1,
//   3500
// )
// camera.position.z = 60
// scene.add(camera)

// // Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.enabled = false

// /**
//  * Renderer
//  */
// const renderer = new THREE.WebGLRenderer({
//   canvas: canvas,
//   antialias: true,
//   alpha: true
// })

// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// /**
//  * Animate
//  */
// const clock = new THREE.Clock()

// const tick = () => {
//   const elapsedTime = clock.getElapsedTime()
//   controls.update()

//   // if (mesh && debugObject.animate) {
//   //   mesh.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2
//   //   mesh.rotation.y = Math.sin(elapsedTime * 0.3) * 0.2
//   // }

//   renderer.render(scene, camera)
//   window.requestAnimationFrame(tick)
// }

// tick()

// /**
//  * Debug
//  */

// gui.addColor(debugObject, 'glitterColor').onChange(() => {
//   textMaterial.color.set(debugObject.glitterColor)
// })

// gui
//   .add(customUniforms.uGlitterSize, 'value')
//   .min(50.0)
//   .max(500.0)
//   .step(10.0)
//   .name('glitterSize')

// gui
//   .add(customUniforms.uGlitterDensity, 'value')
//   .min(0.0)
//   .max(1.0)
//   .step(0.001)
//   .name('glitterDensity')

// // gui.add(debugObject, 'animate').name('animate')
