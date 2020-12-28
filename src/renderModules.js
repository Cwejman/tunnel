import { Renderer, THREE } from 'expo-three';
import * as R from 'ramda';

import * as G from './utils/geometry';

const cameraModule = ({ scene, gl, initialState }) => {
  const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
  const camera = new THREE.PerspectiveCamera(70, aspect, 0.01, 1000);
  camera.position.set(0, 0, 20);
  camera.lookAt(0, 0, 0);
  camera.name = 'camera-main';

  scene.add(camera);

  return ({ controls }) => {
    if (controls.active) {
      const { yaw, roll, pitch, speed } = controls;
      const q = new THREE.Quaternion(pitch *0.02, yaw *0.02, roll *0.01, 1);
      camera.quaternion.multiply(q)
      camera.quaternion.normalize()
      camera.rotation.setFromQuaternion(camera.quaternion, camera.rotation.order);
      camera.translateZ(-speed * 0.05);
    }
  };
};

const lightModule = ({ scene }) => {
  const ambientLight = new THREE.AmbientLight(0x101010);
  scene.add(ambientLight);
};

const circlesModule = ({ scene }) => {
  for (i = 0; i < 100; i++) {
    const circle = G.circle(0.2 + Math.round(Math.random() * 20) / 10 );
    circle.position.x = Math.round(Math.random() * 30);
    circle.position.y = Math.round(Math.random() * 30);
    circle.position.z = Math.round(Math.random() * -30);
    circle.rotation.z = Math.random() * Math.PI
    circle.rotation.x = Math.random() * Math.PI
    circle.rotation.y = Math.random() * Math.PI
    scene.add(circle);
  }
};

const pipeModule = ({ scene }) => {
  const pipe = G.spiral();
  scene.add(pipe);
};

const spiralModule = ({ scene }) => {
    const spiral = G.spiral2();
    scene.add(spiral);
};

const renderModule = ({ scene, gl }) => {
  const renderer = new Renderer({ gl, antialias: true });
  renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
  renderer.setClearColor(0x000000, 0.0);

  scene.fog = new THREE.FogExp2(0x000000, 0.03);

  let renderingCamera = {};

  return ({ currCameraName }) => {
    if (currCameraName !== renderingCamera.name) {
      renderingCamera = scene.children.find(R.propEq('name', currCameraName));
    }
    renderer.render(scene, renderingCamera);
  };
}

export default [cameraModule, lightModule, circlesModule, pipeModule, spiralModule, renderModule];
