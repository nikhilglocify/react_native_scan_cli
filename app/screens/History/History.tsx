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
import {MaterialIcons} from '../../components/ui/TabIcons';
import DownArrow from '../../components/ui/svgIcons/downArrow';
import UpArrow from '../../components/ui/svgIcons/upArrow';

const History = () => {
  type showHistoryCollapse = {
    show: boolean;
  };
  const {removeScan, getCompletedScans, scans, updatedScanList} =
    useScanContext();

  const [showHistory, setShowHistory] = useState<showHistoryCollapse[]>([]);

  const scanHistory = useMemo(() => getCompletedScans(), [scans]);
  console.log('showHistory', showHistory);
  useEffect(() => {
    setShowHistory(scans.map(scan => ({show: false})));
  }, [scans.length]);

  return (
    <View className="flex-1 h-screen mt-[80px] px-6">
      <View>
        <Text
          className="text-2xl font-medium"
          style={{fontFamily: fontFamily.nunitoSemiBold}}>
          Scan History
        </Text>
        {/* <Text className="my-2" style={{fontFamily: fontFamily.nunitoRegular}}>
          Address bar cannot be typed in white the scan is running
        </Text> */}

        {scanHistory && scanHistory.length > 0 ? (
          <ScrollView className="mb-[70px]">
            {scanHistory.map(
              (scan, index) =>
                scan.visitedSites &&
                scan.visitedSites?.length > 0 && (
                  <View
                    key={scan.id}
                    className="bg-white border border-solid border-[#F0F0F0] rounded-[10px] mt-5 mb-4">
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

                        <View className='flex flex-row gap-4'>
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

                          <TouchableOpacity onPress={() => removeScan(scan.id)}>
                            <CrossIcon />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {showHistory[index]?.show && (
                        <View className="mt-2 ms-4">
                          <ScrollView>
                            <View>
                              {scan.visitedSites.map((url, idx) => (
                                <View
                                  key={`${url}-${idx}`}
                                  className="flex flex-row gap-2 mt-1 font-light break-all">
                                  <Text
                                    className="font-light"
                                    style={{
                                      fontFamily: fontFamily.nunitoRegular,
                                    }}>
                                    {idx + 1}.
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
  );
};

export default History;

const styles = StyleSheet.create({});
