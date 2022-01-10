import * as THREE from 'three'

export class GlitterMaterial extends THREE.MeshPhongMaterial {
  constructor (customUniforms, parameters) {
    super()
    this.customUniforms = customUniforms
    this.setValues(parameters)
    this.onBeforeCompile = shader => {
      shader.uniforms.uGlitterSize = this.customUniforms.uGlitterSize
      shader.uniforms.uGlitterDensity = this.customUniforms.uGlitterDensity

      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
              #include <common>
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
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float uGlitterSize;
      uniform float uGlitterDensity;
    

      vec3 hash3( vec2 p ){
          vec3 q = vec3( dot(p,vec2(127.1,311.7)),
                        dot(p,vec2(269.5,183.3)),
                        dot(p,vec2(419.2,371.9)) );
        return fract(sin(q)*43758.5453);
      }

      vec3 findSpecLight (vec3 vnormal, vec3 diffuseColor) {
         vec3 specLight = vec3(0.0,0.0,0.0);
      
          vec3 pointLightPosition = vec3(vPosition) + vec3(.0,.0,1.0);
          vec3 pointLightColor = vec3(1.0, 1.0, 1.0);
          vec3 lightDirection = normalize(vPosition - pointLightPosition);
                  
          specLight.rgb += clamp(dot(-lightDirection, vnormal), 0., .9) * pointLightColor;
          specLight.rgb *= vec3(diffuseColor.rgb);

          return specLight;
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
  }
}
