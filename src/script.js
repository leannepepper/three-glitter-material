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

const geometry = new THREE.SphereBufferGeometry(10, 100, 100)
//const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)

// Material
const material = new THREE.MeshPhongMaterial({
  // transparent: true,
  shininess: 550,
  // vertexColors: true,
  color: 'hotpink'
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
     
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

    vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

    float cnoise(vec2 P){
      vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
      vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
      Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
      vec4 ix = Pi.xzxz;
      vec4 iy = Pi.yyww;
      vec4 fx = Pf.xzxz;
      vec4 fy = Pf.yyww;
      vec4 i = permute(permute(ix) + iy);
      vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
      vec4 gy = abs(gx) - 0.5;
      vec4 tx = floor(gx + 0.5);
      gx = gx - tx;
      vec2 g00 = vec2(gx.x,gy.x);
      vec2 g10 = vec2(gx.y,gy.y);
      vec2 g01 = vec2(gx.z,gy.z);
      vec2 g11 = vec2(gx.w,gy.w);
      vec4 norm = 1.79284291400159 - 0.85373472095314 * 
        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
      g00 *= norm.x;
      g01 *= norm.y;
      g10 *= norm.z;
      g11 *= norm.w;
      float n00 = dot(g00, vec2(fx.x, fy.x));
      float n10 = dot(g10, vec2(fx.y, fy.y));
      float n01 = dot(g01, vec2(fx.z, fy.z));
      float n11 = dot(g11, vec2(fx.w, fy.w));
      vec2 fade_xy = fade(Pf.xy);
      vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
      float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
      return 2.3 * n_xy;
    }


      vec3 hash3( vec2 p ){
          vec3 q = vec3( dot(p,vec2(127.1,311.7)),
                        dot(p,vec2(269.5,183.3)),
                        dot(p,vec2(419.2,371.9)) );
        return fract(sin(q)*43758.5453);
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
            vec3 o = hash3( p + g );
            vec2 r = g - f + o.xy;
            float d = dot(r,r);
            float ww = pow( 1.0-smoothstep(0.5,1.414,sqrt(d)),  k );
            va += o.z*ww; //* sin(uTime * 0.2);
            wt += ww ;
          }

          return va/wt;
      }
      `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <normal_fragment_begin>',
    `
        #include <normal_fragment_begin>

         vec2 p = 0.5 - 0.5*sin( vUv );

          p = p*p*(3.0-2.0*p);
          p = p*p*(3.0-2.0*p);
          p = p*p*(3.0-2.0*p);

          float f = iqnoise( 250.0*(vUv.xy), 1.0, 0.03, normal );
          
          diffuseColor.rgb /= vec3(f);
          
          `
  )
}

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

scene.add(new THREE.AmbientLight(0x444444, 1.6))

const light1 = new THREE.DirectionalLight(0xffffff, 0.4)
light1.position.set(0, 3, 30)
//scene.add(light1)

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

  mesh.rotation.x = elapsedTime * 0.05
  mesh.rotation.y = elapsedTime * 0.15
  light1.position.x = Math.sin(elapsedTime) * 2.5
  light1.position.y = Math.sin(elapsedTime * 0.5) * 100.5

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
