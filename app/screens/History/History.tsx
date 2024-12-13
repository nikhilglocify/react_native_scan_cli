import {
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

const History = () => {
  const {removeScan, getCompletedScans, scans, updatedScanList} =
    useScanContext();

  const scanHistory = useMemo(() => getCompletedScans(), [scans]);
  console.log('scanHistory', scanHistory.length);

  return (
    <View className="flex-1 h-screen mt-[80px] px-6">
      <View>
        <Text
          className="text-2xl font-medium"
          style={{fontFamily: fontFamily.nunitoSemiBold}}>
          Scan History
        </Text>
        <Text className="my-2" style={{fontFamily: fontFamily.nunitoRegular}}>
          Address bar cannot be typed in white the scan is running
        </Text>

        {scanHistory && scanHistory.length > 0 ? (
          <ScrollView className="mb-[70px]">
            {scanHistory.map(scan => {
              return (
                <>
                  {scan.visitedSites?.length && (
                    <View
                      key={scan.id}
                      className="bg-white  border border-solid border-[#F0F0F0] rounded-[10px] mt-5 mb-4">
                      <View className="px-3 py-4">
                        <View className="flex flex-row gap-3 items-start justify-between">
                          <View className="flex flex-row gap-2 items-center">
                            <GreenDot />

                            <Text
                              className="text-md text-[#393939] font-medium leading-5"
                              style={{fontFamily: fontFamily.nunitoRegular}}>
                              {new Date(scan.date).toDateString()}
                            </Text>
                          </View>
                          <TouchableOpacity onPress={() => removeScan(scan.id)}>
                            <CrossIcon />
                          </TouchableOpacity>
                        </View>
                        <View className="mt-2 ms-4">
                          <View className="text-center">
                            {scan.visitedSites && (
                              <ScrollView>
                                <View>
                                  {scan.visitedSites?.map((url, index) => (
                                    <View
                                      className="flex flex-row gap-2 mt-1 font-light break-all"
                                      key={`${url}-${index}`}>
                                      <Text
                                        className="font-light"
                                        style={{
                                          fontFamily: fontFamily.nunitoRegular,
                                        }}>
                                        {index + 1}.
                                      </Text>
                                      <Text
                                        className="text-left font-light break-all whitespace-pre-wrap relative"
                                        style={{
                                          fontFamily: fontFamily.nunitoRegular,
                                        }}>
                                        {url}
                                      </Text>
                                    </View>
                                  ))}
                                </View>
                              </ScrollView>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </>
              );
            })}
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
  );
};

export default History;

const styles = StyleSheet.create({});
