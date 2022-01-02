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

//const geometry = new THREE.SphereBufferGeometry(10, 100, 100)
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)

// Material
const material = new THREE.MeshPhongMaterial({
  transparent: true,
  shininess: 550,
  //vertexColors: true,
  color: 'green'
  // side: THREE.DoubleSide
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
    // Created by inigo quilez - iq/2014
      #include <common>
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float uRandomValue;
    

      vec3 hash3( vec2 p ){
          vec3 q = vec3( dot(p,vec2(127.1,311.7)),
                        dot(p,vec2(269.5,183.3)),
                        dot(p,vec2(419.2,371.9)) );
        return fract(sin(q)*43758.5453);
      }

      vec3 findSpecLight (vec3 vnormal) {
         vec3 addedLights = vec3(0.0,0.0,0.0);
      
          vec3 pointLightPosition = vec3(vPosition) + vec3(.0,.0,1.0);
          vec3 pointLightColor = vec3(1.0, 1.0, 1.0);
          vec3 lightDirection = normalize(vPosition - pointLightPosition);
          addedLights.rgb += clamp(dot(-lightDirection, vnormal), 0., .9) * pointLightColor;
          //addedLights.b += sin(uTime );

          return addedLights;
      }

      float iqnoise( in vec2 x, float u, float v, vec3 vnormal ) {
       // vec3 specLighting = findSpecLight(vnormal);

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
            float ww = pow( 1.0-smoothstep(0.04,.0814,sqrt(d)),  k );
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

         vec3 specLighting = findSpecLight(normal);

         float f = iqnoise( 500.0*(vUv.xy), 1.0, 0.03, normal );
          
          vec3 c = vec3(f) - specLighting; // START HERE  
          //vec3 col = mix( vec3(1.0), specLighting.rgb, smoothstep( 0.23, (0.45), c.z ) );
          diffuseColor.rgb /= vec3(c) ;
          //diffuseColor.rgb = mix(vec3(diffuseColor.x, diffuseColor.y, diffuseColor.z), specLighting, specLighting) + vec3(col);

        
          
          `
  )
}

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

scene.add(new THREE.AmbientLight(0x444444, 1.6))

const light1 = new THREE.DirectionalLight(0xffffff, 0.4)
light1.position.set(0, 3, 30)
// scene.add(light1)

const light2 = new THREE.DirectionalLight(0xffffff, 1.5)
light2.position.set(0, -1, 0)
// scene.add(light2)

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
camera.position.z = 60

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

  mesh.rotation.x = elapsedTime * 0.3
  mesh.rotation.y = elapsedTime * 0.3
  light1.position.x = Math.sin(elapsedTime) * 2.5
  light1.position.y = Math.sin(elapsedTime * 0.5) * 100.5

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
