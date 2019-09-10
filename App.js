import { GLView } from 'expo-gl';
import { View, Text, Button } from 'react-native';
import { Renderer, THREE } from 'expo-three';
import React from 'react';
import * as R from 'ramda';

import Hud from './src/Hud';

const hslToRgb = (h, s, l) => {
  const { r, g, b } = new THREE.Color(`hsl(${h}, ${s}%, ${l}%)`);
  return [r, g, b];
};

const matrixToAttribute = matrix =>
  new THREE.Float32BufferAttribute(R.flatten(matrix), matrix[0].length);

const createSpiral = () => {
  const toPos = (dy, len, iMax) => i => {
    const y = (1 - i/iMax) ** 0.8 * len;
    return [Math.sin(y * 10), y+dy, Math.cos(y * 10)];
  };

  const positions = R.map(toPos(-20, 50, 2000), R.range(0, 2000));
  const colors = positions.map((p, i) => hslToRgb(i ** 1.2 / 100, 100, 50));
  const material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors, linewidth: 3 });

  // console.log(positions[0][1], positions[100][1], positions[500][1], positions[999][1])
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', matrixToAttribute(positions));
  geometry.addAttribute('color', matrixToAttribute(colors));

  const line = new THREE.Line( geometry, material );
  line.computeLineDistances();

  return line
};

const createCircle = (w) => {
  const toPos = i => {
    const t = i / 20 * 2 * Math.PI
    return [Math.sin(t) * w, Math.cos(t) * w, 0];
  }

  const positions = R.map(toPos, R.range(0, 20));
  const material = new THREE.LineBasicMaterial({ color: new THREE.Color('white'), linewidth: 3 });

  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', matrixToAttribute(positions));

  const line = new THREE.Line( geometry, material );
  line.computeLineDistances();

  return line
};

const touchToPoint = ({ pageX: x, pageY: y }) => ({ x, y });
const subPoints = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const midPoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const absPoint = p => ({ x: Math.abs(p.x), y: Math.abs(p.y) });
const clamp = (min, max, num) => Math.max(min, Math.min(max, num));

export default function App() {
  const controls = React.useRef({});
  const speed = React.useRef(0.03);
  const timeout = React.useRef([]);
  const [_, forceRender] = React.useState();

  React.useEffect(() => () => clearTimeout(timeout.current), []);

  const createScene = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    const renderer = new Renderer({ gl, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor( 0x000000, 0.0 );

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.set(0, 20, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.03);
    // scene.add(new THREE.GridHelper(10, 10));

    const ambientLight = new THREE.AmbientLight(0x101010);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0.1);
    spotLight.lookAt(scene.position);
    scene.add(spotLight);

    const spiral = createSpiral();
    scene.add(spiral);

    const circle = createCircle();
    console.log(circle)
    scene.add(circle);

    function update() {
      const t = Date.now() / 1000;
      if (controls.current.active) {
        const { yaw, roll, pitch } = controls.current;
        const q = new THREE.Quaternion(pitch *0.01, yaw *0.01, roll *0.01, 1);
        camera.quaternion.multiply(q)
        camera.quaternion.normalize()
        camera.rotation.setFromQuaternion(camera.quaternion, camera.rotation.order);
        camera.translateZ(-speed.current);
      }
      // camera.position.set(Math.sin(t*2), 20, Math.cos(t* 2));
      spotLight.position = camera.position;
    }

    const render = () => {
      timeout.current = requestAnimationFrame(render);
      update();
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    render();
  };

  const onResponderMove = (e) => {
    const { touches } = e.nativeEvent;
    if (touches.length === 2) {
      const [a, b] = touches.map(touchToPoint);
      const center = absPoint(midPoint(a, b));
      const rot = a.y - b.y;
      const initCenter = controls.current.initCenter || center;
      const initRot = controls.current.initRot || rot;

      const { x: dx, y: dy } = subPoints(initCenter, center);
      const yaw = clamp(-1, 1, dx / 40);
      const pitch = clamp(-1, 1, dy / 40);
      const roll = clamp(-1, 1, (rot - initRot) / 200);

      controls.current = { center, initCenter, initRot, yaw, pitch, roll, active: true };
    } else {
      controls.current = { active: false };
    }
    // forceRender(Date.now())
  };

  const onResponderRelease = () => {
    controls.current = { active: false }
    // forceRender(Date.now());
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: '#111' }}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderReject={() => console.log('reject')}
      onResponderMove={onResponderMove}
      onResponderRelease={onResponderRelease}
    >
      <GLView style={{ position: 'absolute', width: '100%', height: '100%' }} onContextCreate={createScene} />
      <View style={{ position: 'absolute', bottom: 20, left: 20 }}>
        <Button onPress={() => { speed.current += 0.01; forceRender(Date.now()) }} title="+" />
        <Button onPress={() => { speed.current -= 0.01; forceRender(Date.now()) }} title="-" />
      </View>
      <Text style={{color: 'white', position: 'absolute', padding: 20, fontSize: 9 }}>{Math.round(speed.current * 100)}</Text>
      {/* {controls.current.active && <Hud {...controls.current} />} */}
    </View>
  );
}
