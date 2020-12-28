import { THREE } from 'expo-three';
import * as R from 'ramda';

import * as C from './common';

export const spiral2 = () => {
  const toPos = i => {
    const t = i / 200 * 2 * Math.PI * 4
    const r = 1 + t ** 1.4 * 0.5;
    return [Math.sin(t) * r, Math.cos(t) * r, 0];
  }

  const positions = R.map(toPos, R.range(0, 200));
  const material = new THREE.LineBasicMaterial({ color: new THREE.Color('white'), linewidth: 3 });

  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', C.matrixToAttribute(positions));

  const line = new THREE.Line( geometry, material );
  line.computeLineDistances();

  return line
};

export const spiral = () => {
  const toPos = (dy, len, iMax) => i => {
    const y = (1 - i/iMax) ** 0.8 * len;
    return [Math.sin(y * 10), y+dy, Math.cos(y * 10)];
  };

  const positions = R.map(toPos(-50, 50, 2000), R.range(0, 2000));
  const colors = positions.map((p, i) => C.hslToRgb(i ** 1.2 / 100, 100, 50));
  const material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors, linewidth: 3 });

  // console.log(positions[0][1], positions[100][1], positions[500][1], positions[999][1])
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', C.matrixToAttribute(positions));
  geometry.addAttribute('color', C.matrixToAttribute(colors));

  const line = new THREE.Line( geometry, material );
  line.computeLineDistances();

  return line
};

export const circle = (w) => {
  const toPos = i => {
    const t = i / 39 * 2 * Math.PI
    return [Math.sin(t) * w/2, Math.cos(t) * w/2, 0];
  }

  const positions = R.map(toPos, R.range(0, 40));
  const material = new THREE.LineBasicMaterial({ color: new THREE.Color('white'), linewidth: 3 });

  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', C.matrixToAttribute(positions));
  const line = new THREE.Line( geometry, material );
  line.computeLineDistances();

  return line
};

  const line = new THREE.Line( geometry, material );
  line.computeLineDistances();

  return line
};
