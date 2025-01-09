import {ImageBackground, StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import TipHomeIcon from '../../components/ui/svgIcons/TipHomeIcon';
import {fontFamily} from '../../constants/theme';

import {Colors} from '../../constants/Colors';
import AppTheme from '../../components/Layout/AppTheme';
import {getDailyTip} from '../../apis/Tips';
import {Tip} from '../../constants/Interface';
import Loader from '../../components/ui/Loader';

const Tips = () => {
  const [tipData, setTipData] = useState<Tip | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDailyTip = async () => {
    try {
      const data = await getDailyTip();

      setTipData(data?.data);
      console.log('Tip=>Data', tipData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDailyTip();
  }, []);

  if (loading) {
    return <Loader />;
  }
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
            {/* <TipHomeIcon /> */}
            <Image
              style={{height: 100, width: 100}}
              source={{
                uri: 'https://static-00.iconduck.com/assets.00/avatar-default-icon-1975x2048-2mpk4u9k.png',
              }}
              resizeMode="contain"
            />
            <Text
              className="text-lg text-gray-700 mt-8  text-center"
              style={{fontFamily: fontFamily.nunitoRegular}}>
              {/* (A png image and caption below that changes on a daily basis,
              controlled by app adminisstrator remotly) */}
              {tipData?.description}
            </Text>
          </View>
        </View>
      </AppTheme>
    </>
  );
};

export default Tips;

const styles = StyleSheet.create({});
