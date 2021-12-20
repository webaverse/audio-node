import * as THREE from 'three';
// import easing from './easing.js';
import metaversefile from 'metaversefile';
const {useApp, useMaterials, useFrame, useActivate, useLoaders, usePhysics, addTrackedApp, useDefaultModules, useCleanup} = metaversefile;

export default () => {
  const app = useApp();
  const physics = usePhysics();
  const {WebaverseShaderMaterial} = useMaterials();

  const geometry = new THREE.BoxGeometry(16, 4, 16)
    .applyMatrix4(new THREE.Matrix4().makeTranslation(0, 2, 0));
  const material = new WebaverseShaderMaterial({
    uniforms: {
      time: {value: 0},
    },
    vertexShader: `\
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `\
      uniform float time;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        gl_FragColor = vec4(uv.x, uv.y, sin(uv.x * uv.y * time), 1.0);
      }
    `,
    transparent: true,
  });
  /* const material2 = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
  }); */
  const mesh = new THREE.Mesh(geometry, material);
  app.add(mesh);

  let activateCb = null;
  let frameCb = null;
  useActivate(() => {
    activateCb && activateCb();
  });
  useFrame(() => {
    frameCb && frameCb();

    material.uniforms.time.value = performance.now() / 1000;
  });
  
  useCleanup(() => {
    for (const physicsId of physicsIds) {
      physics.removeGeometry(physicsId);
    }
  });

  return app;
};