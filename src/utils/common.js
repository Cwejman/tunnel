import { THREE } from 'expo-three';
import * as R from 'ramda';

export const hslToRgb = (h, s, l) => {
  const { r, g, b } = new THREE.Color(`hsl(${h}, ${s}%, ${l}%)`);
  return [r, g, b];
};

export const matrixToAttribute = matrix =>
  new THREE.Float32BufferAttribute(R.flatten(matrix), matrix[0].length);
