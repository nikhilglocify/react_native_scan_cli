import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";


import { Path, Rect, Svg } from "react-native-svg";
import { useScanContext } from "../../../context/ScanContext";
import GreenDot from "../../components/ui/svgIcons/GreenDot";
import CrossIcon from "../../components/ui/svgIcons/CrossIcon";
import { ScheduledScan } from "../../constants/Interface";



const History = () => {
  const {  removeScan, getCompletedScans, scans } = useScanContext();

  const scanHistory = useMemo(() => getCompletedScans(), [scans.length]);

  return (
    <View className="flex-1 h-screen mt-[40px] px-6">
      <View>
        <Text className="text-2xl font-medium">Scan History</Text>
        <Text className="my-2">
          Address bar cannot be typed in white the scan is running
        </Text>
       
          {scanHistory && scanHistory.length > 0 ? (
            <ScrollView >
           { scanHistory.map((scan) => {
            return (
              <>
                <View
                  key={scan.id}
                  className="bg-white  border border-solid border-[#F0F0F0] rounded-[10px] mt-5 mb-4"
                >
                  <View className="px-3 py-4">
                    <View className="flex flex-row gap-3 items-start justify-between">
                      <View className="flex flex-row gap-2 items-center">
                      <GreenDot />

                      <Text className="text-md text-[#393939] font-medium leading-5">
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
                          <ScrollView >
                            <View>
                              {scan.visitedSites.map((url, index) => (
                                <View
                                  className="flex flex-row gap-2 mt-1 font-light break-all"
                                  key={index}
                                >
                                  <Text className="font-light">
                                    {index + 1}.
                                  </Text>
                                  <Text className="text-left font-light break-all whitespace-pre-wrap relative">
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
              </>
            );
          })}
           </ScrollView>
          ) : (
            <View className="flex items-center mt-20 h-screen">
            <Text className="text-center text-lg">
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
