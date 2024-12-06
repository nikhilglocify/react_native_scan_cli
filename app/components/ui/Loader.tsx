import React from 'react'

import { ActivityIndicator ,StyleSheet, View} from 'react-native'

const Loader = () => {
  return (
    <View style={styles.fullScreenCenter}>
        <ActivityIndicator size="large" />
      </View>
  )
}

export default Loader


const styles=StyleSheet.create({
    fullScreenCenter: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
})