import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Circle, G, Line, Mask, Path, Rect, Svg} from 'react-native-svg';
import { svgProps } from '../../../constants/Interface';

const AddScanIcon = (props:svgProps) => {
  return (
    <Svg height="50" width="50" viewBox="0 0 50 50">
      {/* Outer Circle */}
      <Circle
        cx="25"
        cy="25"
        r="24"
        stroke={props.color || "black"}
        strokeWidth="2"
        fill={props.color || "black"}
      />
      {/* Plus Sign */}
      <Line x1="25" y1="15" x2="25" y2="35" stroke="white" strokeWidth="3" />
      <Line x1="15" y1="25" x2="35" y2="25" stroke="white" strokeWidth="3" />
    </Svg>
    //   <Svg width="50" height="50" viewBox="0 0 42 42" fill="none">
    //   <Mask
    //     id="mask0_4_219"
    //     style={{ maskType: "luminance" }}
    //     maskUnits="userSpaceOnUse"
    //     x="2"
    //     y="2"
    //     width="38"
    //     height="38"
    //   >
    //     <Path
    //       d="M21 38.5C30.6652 38.5 38.5 30.6652 38.5 21C38.5 11.3348 30.6652 3.5 21 3.5C11.3348 3.5 3.5 11.3348 3.5 21C3.5 30.6652 11.3348 38.5 21 38.5Z"
    //       fill="white"
    //       stroke="white"
    //       strokeWidth="2"
    //       strokeLinejoin="round"
    //     />
    //     <Path
    //       d="M21 14V28M14 21H28"
    //       stroke="black"
    //       strokeWidth="2"
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //     />
    //   </Mask>
    //   <G mask="url(#mask0_4_219)">
    //     <Rect x="0" y="0" width="42" height="42" fill="#23B0C2" />
    //   </G>
    // </Svg>
  );
};

export default AddScanIcon;

const styles = StyleSheet.create({});
