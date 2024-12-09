import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Path, Svg} from 'react-native-svg';

const TabHistoryIcon = () => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
     >
      <Path
        d="M19.1611 10V2.5C19.1611 2.10218 19.0031 1.72064 18.7218 1.43934C18.4405 1.15804 18.059 1 17.6611 1H2.66113C2.26331 1 1.88178 1.15804 1.60047 1.43934C1.31917 1.72064 1.16113 2.10218 1.16113 2.5V17.5C1.16113 17.8978 1.31917 18.2794 1.60047 18.5607C1.88178 18.842 2.26331 19 2.66113 19H10.1611"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.1611 17C15.818 17 17.1611 15.6569 17.1611 14C17.1611 12.3431 15.818 11 14.1611 11C12.5043 11 11.1611 12.3431 11.1611 14C11.1611 15.6569 12.5043 17 14.1611 17Z"
        stroke="white"
        strokeWidth="1.5"
      />
      <Path
        d="M16.6611 16L19.1611 18M5.16113 6H15.1611M5.16113 10H9.16113"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default TabHistoryIcon;

const styles = StyleSheet.create({});
