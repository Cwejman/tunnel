import * as R from 'ramda';

import * as M from './utils/math';

const touchToPoint = ({ pageX: x, pageY: y }) => ({ x, y });

export const gestureMove = (e) => R.evolve({
  controls: (controls) => {
    const { touches } = e.nativeEvent;
    if (touches.length === 2) {
      const [a, b] = touches.map(touchToPoint);
      const center = M.absPoint(M.midPoint(a, b));
      const rot = a.y - b.y;
      const distance = ((a.x - b.x) ** 2 + (a.y - b.y) ** 2) ** 0.5;

      const initCenter = controls.initCenter || center;
      const initRot = controls.initRot || rot;
      const initDistance = controls.initDistance || distance;

      const { x: dx, y: dy } = M.subPoints(initCenter, center);
      const yaw = M.clamp(-1, 1, dx / 40) * 0.02;
      const pitch = M.clamp(-1, 1, dy / 40) * 0.02;
      const roll = M.clamp(-1, 1, (rot - initRot) / 200) * 0.01;
      const speed = M.clamp(0.5, 2, 1 + (distance - initDistance) / 100) * 0.03;

      return { initCenter, initRot, initDistance, yaw, pitch, roll, speed, active: true };
    } else {
      return { active: false };
    }
  },
});

export const gestureRelease = () => R.assoc('controls', { active: false });

export const setDimensions = (width, height) => R.assoc('dimensions', { width, height });
