import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Path, Svg } from 'react-native-svg'

const CrossIcon = () => {
  return (
    <Svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 7C14 10.8661 10.8661 14 7 14C3.1339 14 0 10.8661 0 7C0 3.1339 3.1339 0 7 0C10.8661 0 14 3.1339 14 7ZM4.879 4.879C4.97744 4.78068 5.11087 4.72546 5.25 4.72546C5.38913 4.72546 5.52256 4.78068 5.621 4.879L7 6.258L8.379 4.879C8.47852 4.78626 8.61015 4.73578 8.74617 4.73818C8.88218 4.74058 9.01195 4.79568 9.10813 4.89186C9.20432 4.98805 9.25942 5.11782 9.26182 5.25383C9.26422 5.38985 9.21374 5.52148 9.121 5.621L7.742 7L9.121 8.379C9.21374 8.47852 9.26422 8.61015 9.26182 8.74617C9.25942 8.88218 9.20432 9.01195 9.10813 9.10813C9.01195 9.20432 8.88218 9.25942 8.74617 9.26182C8.61015 9.26422 8.47852 9.21374 8.379 9.121L7 7.742L5.621 9.121C5.52148 9.21374 5.38985 9.26422 5.25383 9.26182C5.11782 9.25942 4.98805 9.20432 4.89186 9.10813C4.79568 9.01195 4.74058 8.88218 4.73818 8.74617C4.73578 8.61015 4.78626 8.47852 4.879 8.379L6.258 7L4.879 5.621C4.78068 5.52256 4.72546 5.38913 4.72546 5.25C4.72546 5.11087 4.78068 4.97744 4.879 4.879Z"
      fill="#FF3D3D"
      fillOpacity="0.7"
    />
  </Svg>
  )
}

export default CrossIcon

const styles = StyleSheet.create({})