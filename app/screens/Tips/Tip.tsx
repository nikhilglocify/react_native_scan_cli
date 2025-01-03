import {ImageBackground, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import TipHomeIcon from '../../components/ui/svgIcons/TipHomeIcon';
import {fontFamily} from '../../constants/theme';

import {Colors} from '../../constants/Colors';
// import TipHomeIcon from '@/components/ui/svgIcons/TipHomeIcon'

const Tips = () => {
  return (
    <>
      <ImageBackground
        source={require('../../assets/images/App-bg.png')}
        style={{flex: 1, backgroundColor: 'black'}}>
        <View
          className="p-4 inline-block w-[250px] mx-auto border-b-8"
          style={{backgroundColor: Colors['light'].themeOrange}}>
          <Image
            source={require('../../assets/images/app_logo.png')}
            style={{
              width: '100%',
              height: 50,
              padding: 10,
            }}
            resizeMode="contain"
          />
        </View>
        <View className="flex-1 h-screen mt-[30px] px-4">
          <View
            style={{backgroundColor: Colors['light'].themeOrange}}
            className="p-2">
            <Text
              className="text-xl text-white text-center mb-2"
              style={{fontFamily: fontFamily.nunitoSemiBold}}>
              Daily Tips
            </Text>
            <Text
              className="text-base text-white text-center"
              style={{fontFamily: fontFamily.nunitoRegular}}>
              At vero eos et accusamus et iusto odio dignissimos.
            </Text>
          </View>
          <View className="flex justify-center items-center h-[410px]  box-content  p-3 rounded-lg bg-white  mt-4">
            <TipHomeIcon />
            <Text
              className="text-lg text-gray-700 mt-12  text-center"
              style={{fontFamily: fontFamily.nunitoRegular}}>
              (A png image and caption below that changes on a daily basis,
              controlled by app adminisstrator remotly)
            </Text>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default Tips;

const styles = StyleSheet.create({});
