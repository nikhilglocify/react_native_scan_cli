import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useScanContext} from '../../../context/ScanContext';
import GreenDot from '../../components/ui/svgIcons/GreenDot';
import CrossIcon from '../../components/ui/svgIcons/CrossIcon';
import {fontFamily} from '../../constants/theme';
import {MaterialIcons} from '../../components/ui/TabIcons';
import DownArrow from '../../components/ui/svgIcons/DownArrow';
import UpArrow from '../../components/ui/svgIcons/UpArrow';
import Clipboard from '@react-native-clipboard/clipboard';
import {copyToClipboard} from '../../helpers';
import CopyIcon from '../../components/ui/svgIcons/CopyIcon';
import {Colors} from '../../constants/Colors';

const History = () => {
  type showHistoryCollapse = {
    show: boolean;
  };
  const {removeScan, getCompletedScans, scans, updatedScanList} =
    useScanContext();

  const [showHistory, setShowHistory] = useState<showHistoryCollapse[]>([]);

  const scanHistory = useMemo(() => getCompletedScans(), [scans]);
  // console.log('showHistory', showHistory);
  useEffect(() => {
    setShowHistory(scans.map(scan => ({show: false})));
  }, [scans.length]);

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

        <View className="flex-1 h-screen mt-[30px] px-6">
          <View>
            <View
              style={{backgroundColor: Colors['light'].themeOrange}}
              className="p-2">
              <Text
                className="text-xl text-white text-center mb-2"
                style={{fontFamily: fontFamily.nunitoSemiBold}}>
                History
              </Text>
              <Text
                className="text-base text-white text-center"
                style={{fontFamily: fontFamily.nunitoRegular}}>
                At vero eos et accusamus et iusto odio dignissimos.
              </Text>
            </View>

            {scanHistory && scanHistory.length > 0 ? (
              <ScrollView className="mb-[150px] mt-4">
                {scanHistory.map(
                  (scan, index) =>
                    scan.visitedSites &&
                    scan.visitedSites?.length > 0 && (
                      <View
                        key={scan.id}
                        className="bg-white border border-solid border-[#F0F0F0] rounded-[10px] my-2">
                        <View className="px-3 py-4">
                          <View className="flex flex-row gap-3 items-start justify-between">
                            <View className="flex flex-row gap-2 items-center">
                              <GreenDot />
                              <Text
                                className="text-md text-[#393939] font-medium leading-5"
                                style={{fontFamily: fontFamily.nunitoRegular}}>
                                {new Date(scan.date).toDateString()},{' '}
                                {new Date(scan.date).toLocaleTimeString()}
                              </Text>
                            </View>

                            <View className="flex flex-row gap-4">
                              <TouchableOpacity
                                onPress={() => {
                                  setShowHistory(prevState =>
                                    prevState.map((item, i) =>
                                      i === index
                                        ? {...item, show: !item.show}
                                        : item,
                                    ),
                                  );
                                }}>
                                {showHistory[index]?.show ? (
                                  <UpArrow height={12} width={12} />
                                ) : (
                                  <DownArrow height={12} width={12} />
                                )}
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => removeScan(scan.id)}>
                                <CrossIcon />
                              </TouchableOpacity>
                            </View>
                          </View>

                          {showHistory[index]?.show && (
                            <View className="mt-2  p-0">
                              <ScrollView>
                                <View>
                                  {scan.visitedSites.map((url, idx) => (
                                    <View
                                      key={`${url}-${idx}`}
                                      className="flex-row gap-1 mt-1 font-light w-[100%] justify-between">
                                      <View className="flex-row gap-2 break-all w-[88%]">
                                        <Text
                                          className="font-light"
                                          style={{
                                            fontFamily:
                                              fontFamily.nunitoRegular,
                                          }}>
                                          {idx + 1}.
                                        </Text>
                                        <Text
                                          className="text-left font-light break-all relative"
                                          style={{
                                            fontFamily:
                                              fontFamily.nunitoRegular,
                                          }}>
                                          {url}
                                        </Text>
                                      </View>
                                      <TouchableOpacity
                                        className="float-right"
                                        onPress={() => copyToClipboard(url)}>
                                        <CopyIcon height={18} width={18} />
                                      </TouchableOpacity>
                                    </View>
                                  ))}
                                </View>
                              </ScrollView>
                            </View>
                          )}
                        </View>
                      </View>
                    ),
                )}
              </ScrollView>
            ) : (
              <View className="flex items-center mt-20 h-screen">
                <Text
                  className="text-center text-lg"
                  style={{fontFamily: fontFamily.nunitoRegular}}>
                  No Scans Found...
                </Text>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default History;

const styles = StyleSheet.create({});
