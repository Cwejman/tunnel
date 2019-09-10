import React from 'react';
import { View } from 'react-native';
import { Svg, Circle, Rect } from 'react-native-svg';

const style = {
  flex: 1,
};

const clamp = (min, max, num) => Math.max(min, Math.min(max, num));

export default ({ initCenter, yaw, pitch, roll }) => {

  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <Svg height="60px" width="60px" viewBox="0 0 100 100">
        {/* <Circle cx="50" cy="50" r="5" fill="white" /> */}
        <Rect
          x="10"
          y="48"
          width="30"
          height="4"
          fill="white"
          fillOpacity={0.2}
        />
        <Rect
          rotation={180}
          origin="25,50"
          x="10"
          y="48"
          width={clamp(0, 30, yaw * 30)}
          height="4"
          fill="white"
          fillOpacity={0.6}
        />
        <Rect
          x="60"
          y="48"
          width="30"
          height="4"
          fill="white"
          fillOpacity={0.2}
        />
        <Rect
          x="60"
          y="48"
          width={-clamp(-30, 0, yaw * 30)}
          height="4"
          fill="white"
          fillOpacity={0.6}
        />
        <Rect
          x="48"
          y="60"
          width="4"
          height="30"
          fill="white"
          fillOpacity={0.2}
        />
        <Rect
          x="48"
          y="60"
          height={-clamp(-30, 0, pitch * 30)}
          width="4"
          fill="white"
          fillOpacity={0.6}
        />
        <Rect
          x="48"
          y="10"
          width="4"
          height="30"
          fill="white"
          fillOpacity={0.2}
        />
        <Rect
          x="48"
          y="10"
          origin="50,25"
          rotation={180}
          height={clamp(0, 30, pitch * 30)}
          width="4"
          fill="white"
          fillOpacity={0.6}
        />
        <Circle
          stroke="white"
          strokeWidth="4"
          strokeOpacity={0.4}
          fill="transparent"
          r="46"
          cx="50"
          cy="50"
          style={{ strokeDasharray: Math.PI * 92 + ' ' + Math.PI * 92, strokeDashoffset: Math.PI * (1 - roll) * 92 }}
        />
      </Svg>
    </View>
  );
}
