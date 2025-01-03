import { StyleSheet } from 'react-native';
import React from 'react';
import { svgProps } from '../../../constants/Interface';
import { G, Path, Circle, Svg } from 'react-native-svg';

const LeftCircleIcon = (props: svgProps) => {
  return (
    <Svg
      width={props.width || "100"}
      height={props.height || "100"}
      viewBox="0 0 100 100"
    >
      {/* Outer Circle */}
      <Circle
        cx="50" // Center x-coordinate
        cy="50" // Center y-coordinate
        r="48" // Radius (adjust for thickness)
        fill="white" // Fill inside the circle
        stroke="black" // Outer circle border color
        strokeWidth="4" // Border thickness
      />

      <G>
        {/* Backward Arrow */}
        <Path
          d="M44.942,50.412l14.037-15.487c0.742-0.818,0.68-2.083-0.139-2.824c-0.817-0.742-2.083-0.679-2.824,0.139L40.784,49.044
       c-0.409,0.451-0.565,1.038-0.493,1.598c-0.016,0.564,0.196,1.131,0.647,1.539L57.74,67.412c0.383,0.348,0.864,0.519,1.344,0.519
       c0.545,0,1.087-0.222,1.482-0.657c0.741-0.818,0.68-2.083-0.139-2.824L44.942,50.412z"
          fill="black" // Fill for the backward arrow
        />
      </G>
    </Svg>
  );
};

export default LeftCircleIcon;

const styles = StyleSheet.create({});
