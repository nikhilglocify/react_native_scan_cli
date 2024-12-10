import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TipHomeIcon from '../../components/ui/svgIcons/TipHomeIcon'
// import TipHomeIcon from '@/components/ui/svgIcons/TipHomeIcon'

const Tips = () => {
  return (
    <View className="flex-1 h-screen mt-[45px] px-4">
      <Text className="text-2xl font-medium">Daily Tip</Text>
      <View className="flex justify-center items-center h-[410px]  box-content  p-3 rounded-lg bg-white  mt-4">
      <TipHomeIcon />
      <Text className="text-lg text-gray-700 mt-12  text-center">
      (A png image and caption below that changes on a daily basis, controlled by app adminisstrator remotly)
      </Text>
      </View>
    </View>
  )
}

export default Tips

const styles = StyleSheet.create({})