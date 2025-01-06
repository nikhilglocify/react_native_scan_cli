import {ImageBackground, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import TipHomeIcon from '../../components/ui/svgIcons/TipHomeIcon';
import {fontFamily} from '../../constants/theme';

import {Colors} from '../../constants/Colors';
import AppTheme from '../../components/Layout/AppTheme';

const Tips = () => {
  return (
    <>
      <AppTheme>
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
      </AppTheme>
    </>
  );
};

export default Tips;

const styles = StyleSheet.create({});
