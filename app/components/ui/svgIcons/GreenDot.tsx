import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Rect, Svg } from "react-native-svg";

const GreenDot = () => {
  return (
    <Svg width="6" height="6" viewBox="0 0 6 6" fill="none">
      <Rect width="6" height="6" rx="3" fill="#41CE81" />
    </Svg>
  );
};

export default GreenDot;

const styles = StyleSheet.create({});
