import {ImageBackground, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {Colors} from '../../constants/Colors';

const AppTheme = ({children}: any) => {
  return (
    <ImageBackground
      source={require('../../assets/images/App-bg.png')}
      style={{
        flex: 1,
      }}>
      <View
        className="p-4 inline-block w-[250px] mx-auto"
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
      {children}
    </ImageBackground>
  );
};

export default AppTheme;

const styles = StyleSheet.create({});
