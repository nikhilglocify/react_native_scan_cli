import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { G, Mask, Path, Rect, Svg } from 'react-native-svg'

const AddScanIcon = () => {
  return (
    <Svg width="50" height="50" viewBox="0 0 42 42" fill="none">
    <Mask
      id="mask0_4_219"
      style={{ maskType: "luminance" }}
      maskUnits="userSpaceOnUse"
      x="2"
      y="2"
      width="38"
      height="38"
    >
      <Path
        d="M21 38.5C30.6652 38.5 38.5 30.6652 38.5 21C38.5 11.3348 30.6652 3.5 21 3.5C11.3348 3.5 3.5 11.3348 3.5 21C3.5 30.6652 11.3348 38.5 21 38.5Z"
        fill="white"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Path
        d="M21 14V28M14 21H28"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Mask>
    <G mask="url(#mask0_4_219)">
      <Rect x="0" y="0" width="42" height="42" fill="#23B0C2" />
    </G>
  </Svg>
  )
}

export default AddScanIcon

const styles = StyleSheet.create({})