import { GLView } from 'expo-gl';
import { View, Text, Button } from 'react-native';
import { THREE } from 'expo-three';
import React, { useRef, useState, useEffect } from 'react';

import useStore from './src/hooks/useStore';
import renderModules from './src/renderModules';
import * as actionsMap from './src/actionsMap';

const initialState = {
  controls: { active: false },
  currCameraName: 'camera-main',
};

export default function App() {
  const [state, actions] = useStore(initialState, actionsMap);
  const timeout = useRef();

  useEffect(() => () => clearTimeout(timeout.current), []);

  const createScene = async (gl) => {
    actions.setDimensions(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const scene = new THREE.Scene();
    const moduleUpdaters = renderModules.map(f => f(scene, gl)).filter(x => x);

    const render = () => {
      timeout.current = requestAnimationFrame(render);
      const currState = state.current;
      moduleUpdaters.forEach(f => f(currState));
      gl.endFrameEXP();
    };

    render();
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: '#111' }}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderReject={() => console.log('reject')}
      onResponderMove={actions.gestureMove}
      onResponderRelease={actions.gestureRelease}
    >
      <GLView style={{ position: 'absolute', width: '100%', height: '100%' }} onContextCreate={createScene} />
      {/* <View style={{ position: 'absolute', bottom: 20, left: 20 }}> </View> */}
    </View>
  );
}
