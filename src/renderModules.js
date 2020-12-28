import { Renderer, THREE } from 'expo-three';
import * as R from 'ramda';

import * as G from './utils/geometry';

const cameraModule = ({ scene, gl, initialState }) => {
  const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
  const camera = new THREE.PerspectiveCamera(70, aspect, 0.01, 1000);
  const initPart = initialState.player.parts[0];
  camera.position.copy(initPart.position);
  camera.rotation.copy(initPart.rotation);
  camera.translateZ(1);
  camera.name = 'camera-main';

  scene.add(camera);

  return ({ player }) => {
    const lastPart = player.parts[0].clone()
    lastPart.translateZ(0.5);

    camera.rotation.setFromQuaternion(lastPart.quaternion, lastPart.rotation.order);
    camera.position.copy(lastPart.position);
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

const modOf = (n, offset, list) => list.filter((x, i) => !((i + offset) % n));

const playerModule = ({ scene, gl, initialState }) => {
  const group = new THREE.Group();

  modOf(15, 3, initialState.player.parts).forEach((part) => {
    const child = G.circle(1);
    child.position.copy(part.position);
    group.add(child);
  });

  scene.add(group);

  return ({ player }) => {
    modOf(15, 3, player.parts).forEach((part, i) => {
      group.children[i].position.copy(part.position);
      group.children[i].rotation.setFromVector3(part.rotation);
    });
  }
}

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

export default [cameraModule, lightModule, circlesModule, pipeModule, spiralModule, playerModule, renderModule];
