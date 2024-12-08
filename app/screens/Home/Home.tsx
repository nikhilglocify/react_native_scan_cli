import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {useEffect, useMemo, useState} from 'react';
import {ScanIcon} from '../../components/ui/svgIcons/Scan';
import AddScanIcon from '../../components/ui/svgIcons/AddScanIcon';
import TimerIcon from '../../components/ui/svgIcons/TimerIcon';
import DeleteIcon from '../../components/ui/svgIcons/DeleteIcon';
import {useScanContext} from '../../../context/ScanContext';
import AddScanModal from '../../components/Scan/AddScanModal';

// import Svg, { Path, Rect, Mask, G } from "react-native-svg";
// import { getScansLocally } from "@/helpers/asyncStorage";
// import { ScheduledScan } from "@/constants/Interface";
// import { useScanContext } from "@/context/ScanContext";
// import { router } from "expo-router";
// import { ScanIcon } from "@/components/ui/svgIcons/Scan";
// import TimerIcon from "@/components/ui/svgIcons/TimerIcon";
// import DeleteIcon from "@/components/ui/svgIcons/DeleteIcon";
// import AddScanIcon from "@/components/ui/svgIcons/AddScanIcon";
// import * as BackgroundFetch from "expo-background-fetch";
// import * as TaskManager from "expo-task-manager";
export default function HomeScreen({navigation}) {
  const [visibleScanModal, setVisibleScanModal] = useState(false);
  const {
    scans,
    addScan,
    removeScan,
    getScheduledScans,
    setScanList,
    setInitNewScan,
    initNewScan,
    checkForScan,
    setCheckForScan,
  } = useScanContext();
  const BACKGROUND_FETCH_TASK = 'background-fetch-task';
  const scheduledScans = useMemo(() => getScheduledScans(), [scans.length]);
  // useEffect(() => {
  //   const fetchScans = async () => {
  //     const scanList = await getScansLocally();
  //     setScanList(scanList || []);

  //     await registerBackgroundFetchAsync()
  //   };
  //   fetchScans();

  // }, []);

  // // heck every minute

  // async function registerBackgroundFetchAsync() {
  //   console.log("registerBackgroundFetchAsync")
  //   return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
  //     minimumInterval: 60, // 15 minutes
  //     stopOnTerminate: false, // android only,
  //     startOnBoot: true, // android only
  //   });
  // }
  // // 1. Define the task by providing a name and the function that should be executed
  // // Note: This needs to be called in the global scope (e.g outside of your React components)
  // TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  //   const now = Date.now();

  //   console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

  //   // Be sure to return the successful result type!
  //   return BackgroundFetch.BackgroundFetchResult.NewData;
  // });

  return (
    <>
      <View className="flex-1 h-screen mt-[40px]">
        <SafeAreaView className="flex-1">
          <View className="px-4">
            <View className="flex flex-row items-center justify-between mb-9">
              <Text className="text-2xl font-medium">Scheduled Scans</Text>

              <Pressable
                onPress={() => {
                  // router.push("/screens/scan/RunScan");
                  navigation.navigate("RunScan")
                  setCheckForScan(!checkForScan);
                }}>
                <ScanIcon />
              </Pressable>
            </View>
          </View>{' '}
          {scheduledScans.length > 0 ? (
            <ScrollView className="p-4">
              {scheduledScans.map((scan: any) => (
                <View
                  key={scan.id}
                  className="bg-white shadow-[0_5px_15px_0_rgba(0,0,0,0.2)] border border-solid border-[#F0F0F0] rounded-[10px] mt-1 mb-4">
                  <View className="flex flex-row p-2 gap-3 items-center justify-between">
                    <View className="flex flex-row gap-3 items-center">
                      <TimerIcon />
                      <View>
                        <Text className="text-md text-[#393939] leading-5">
                          {new Date(scan.time).toLocaleTimeString()}
                        </Text>
                        <Text className="text-md text-[#393939] leading-5">
                          Duration: {scan.scanDuration} sites
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => removeScan(scan.id)}>
                      <DeleteIcon />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text className="text-center my-auto text-lg">
              No Scheduled Scans Found...
            </Text>
          )}
        </SafeAreaView>
        <View className="position-absolute bottom-[2px] left-0 right-0 mx-auto">
          <Pressable onPress={() => setVisibleScanModal(true)}>
            <AddScanIcon />
          </Pressable>
        </View>
        <AddScanModal
          visible={visibleScanModal}
          onClose={() => setVisibleScanModal(false)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
