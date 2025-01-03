import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {svgProps} from '../../../constants/Interface';
import {G, Path, Svg} from 'react-native-svg';

const LeftCircleIcon = (props: svgProps) => {
  return (
    <Svg
      fill="#fff"
      width={props.width || "800px"}
      height={props.height || "800px"}
      viewBox="0 0 100 100"
      enable-background="new 0 0 100 100"
      
      >
      <G>
        <Path
          d="M44.942,50.412l14.037-15.487c0.742-0.818,0.68-2.083-0.139-2.824c-0.817-0.742-2.083-0.679-2.824,0.139L40.784,49.044
       c-0.409,0.451-0.565,1.038-0.493,1.598c-0.016,0.564,0.196,1.131,0.647,1.539L57.74,67.412c0.383,0.348,0.864,0.519,1.344,0.519
       c0.545,0,1.087-0.222,1.482-0.657c0.741-0.818,0.68-2.083-0.139-2.824L44.942,50.412z"
        />
        <Path
          d="M84.133,49.756c0-18.448-15.01-33.457-33.458-33.457S17.218,31.308,17.218,49.756c0,18.449,15.009,33.458,33.457,33.458
       S84.133,68.205,84.133,49.756z M50.675,79.214c-16.243,0-29.457-13.215-29.457-29.458c0-16.242,13.214-29.457,29.457-29.457
       c16.243,0,29.458,13.215,29.458,29.457C80.133,65.999,66.918,79.214,50.675,79.214z"
        />
      </G>
    </Svg>
  );
};

export default LeftCircleIcon;

const styles = StyleSheet.create({});
