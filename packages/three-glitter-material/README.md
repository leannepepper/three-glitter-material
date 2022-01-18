## three-glitter-material

A threejs material that extends PhongMaterial to give a glitter-like effect.

## Usage

```bash
npm install three-glitter-material
```

```javascript
import { GlitterMaterial } from 'three-glitter-material'

const customUniforms = {
  uGlitterSize: { value: 30.0 },
  uGlitterDensity: { value: 1.0 },
  color: { value: '#a007f2' }
}

const glitterMaterial = new GlitterMaterial(customUniforms, {
  color: customUniforms.color.value
})

const geometry = new THREE.Sphere(3, 32, 32)
mesh = new THREE.Mesh(geometry, glitterMaterial)
scene.add(mesh)
```

## Supported uniforms

```glsl
   uniform float uGlitterSize; // size of individual glitter flakes
   uniform float uGlitterDensity; // controls color intensity of glitter flakes to give the appearance of higher or lower density

```

## Credits

Glsl noise and hash functions created by Inigo Quilez
