import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';

import {useEffect, useMemo, useState} from 'react';
import AddScanIcon from '../../components/ui/svgIcons/AddScanIcon';
import TimerIcon from '../../components/ui/svgIcons/TimerIcon';
import DeleteIcon from '../../components/ui/svgIcons/DeleteIcon';
import {useScanContext} from '../../../context/ScanContext';
import AddScanModal from '../../components/Scan/AddScanModal';
import crashlytics from '@react-native-firebase/crashlytics';
import {createNotifeeNotificationChannel} from '../../services/PushNotificationConfig';

import {Scan} from '../../constants/enums';
import {fontFamily} from '../../constants/theme';
import Loader from '../../components/ui/Loader';
import {Colors} from '../../constants/Colors';
import useHandleNotifiactionAction from '../../hooks/useHandleNotifiactionAction';
import AppTheme from '../../components/Layout/AppTheme';

export default function HomeScreen({navigation}: any) {
  const [visibleScanModal, setVisibleScanModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    scans,
    removeScan,
    getScheduledScans,
    setScanList,
    updatedScanList,
    checkForScan,
    setCheckForScan,
  } = useScanContext();

  const scheduledScans = useMemo(
    () => getScheduledScans(),
    [scans, updatedScanList],
  );

  //hook to handle NotificationActions and Scan navigation
  useHandleNotifiactionAction({navigation});

  useEffect(() => {
    createNotifeeNotificationChannel();
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  }, []);
  // useEffect(() => {
  //   // async function createChannel() {
  //   //   await notifee.createChannel({
  //   //     id: 'default',
  //   //     name: 'Default Channel',
  //   //     importance: AndroidImportance.HIGH, // High importance
  //   //     sound: 'hollow',
  //   //   });
  //   // }

  //   // createChannel();

  //   // Register foreground event listener
  //   const unsubscribeForeground = notifee.onForegroundEvent(
  //     async ({type, detail}) => {
  //       if (type === EventType.ACTION_PRESS && detail?.pressAction?.id) {
  //         const actionId = detail?.pressAction?.id;

  //         console.log(
  //           'Foreground User pressed an action with the id: ',
  //           detail.pressAction.id,
  //           detail.notification?.data,
  //         );
  //         setTimeout(() => {
  //           if (actionId === 'open_now' || actionId == 'default') {

  //             navigation.navigate('RunScan', detail.notification?.data);

  //           }
  //         }, 1000);
  //       }

  //       if (type === EventType.PRESS) {
  //         console.log(
  //           'Notification PRESS IOs in Foreground:',
  //           detail.notification,
  //         );

  //         // Check which action was pressed (Open Now or Ignore)
  //         const actionId = detail?.pressAction?.id;
  //         console.log('actionId', actionId);
  //         setTimeout(() => {
  //           if (actionId === 'open_now' || actionId == 'default') {
  //             // Handle "Open Now" action
  //             navigation.navigate('RunScan', detail.notification?.data);

  //           }
  //         }, 1000);
  //       }
  //     },
  //   );

  //   // Register background event listener
  //   notifee.onBackgroundEvent(async ({type, detail}) => {
  //     if (type === EventType.ACTION_PRESS && detail?.pressAction?.id) {
  //       console.log(
  //         'Background User pressed an action with the id: ',
  //         detail.pressAction.id,
  //       );
  //       const actionId = detail?.pressAction?.id;
  //       setTimeout(() => {
  //         if (actionId === 'open_now' || actionId == 'default') {
  //           // Handle "Open Now" action
  //           navigation.navigate('RunScan', detail.notification?.data);
  //         }
  //       }, 1000);
  //     }

  //     if (type === EventType.PRESS) {
  //       console.log(
  //         'Notification  EventType.PRESS Pressed in Background:',
  //         detail.notification,
  //       );

  //       // Check which action was pressed (Open Now or Ignore)
  //       const actionId = detail?.pressAction?.id;

  //       setTimeout(() => {
  //         if (actionId === 'open_now' || actionId == 'default') {
  //           // Handle "Open Now" action
  //           navigation.navigate('RunScan', detail.notification?.data);
  //           // Alert.alert('Scan Opened', 'You have accepted the scan request.');
  //         }
  //       }, 1000);
  //     }
  //   });

  //   // Clean up the foreground listener when the component unmounts
  //   return () => {
  //     unsubscribeForeground(); // Unsubscribe from the foreground listener
  //   };
  // }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <AppTheme>
        <View className="flex-1 h-screen mt-[30px]">
          <View className="px-4">
            <View className="flex flex-row items-center justify-between mb-4">
              <View
                style={{backgroundColor: Colors['light'].themeOrange}}
                className="p-2 w-[72%] min-h-[85px] max-h-[85px]">
                <Text
                  className="text-base text-white"
                  style={{fontFamily: fontFamily.nunitoRegular}}>
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque.
                </Text>
              </View>

              <Pressable
                onPress={() => {
                  navigation.navigate('RunScan', {scanNow: true});
                  setCheckForScan(!checkForScan);
                }}>
                <View
                  style={{backgroundColor: Colors['light'].themeOrange}}
                  className="p-5 min-h-[85px] max-h-[85px]">
                  <Text
                    className="text-xl"
                    style={{
                      fontFamily: fontFamily.nunitoSemiBold,
                      color: Colors['light'].white,
                    }}>
                    Run{'\n'}Now
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
          {scheduledScans.length > 0 ? (
            <ScrollView className="p-4 mb-[25px] pb-2">
              {scheduledScans.map((scan: any) => (
                <View
                  key={scan.id}
                  className="bg-white shadow-[0_5px_15px_0_rgba(0,0,0,0.2)] border border-solid border-[#F0F0F0] rounded-[10px] mt-1 mb-4">
                  <View className="flex flex-row p-2 gap-3 items-center justify-between">
                    <View className="flex flex-row gap-3 items-center">
                      <TimerIcon />
                      <View>
                        <Text
                          className="text-md text-[#393939] leading-5"
                          style={{fontFamily: fontFamily.nunitoRegular}}>
                          {new Date(scan.time).toLocaleTimeString()}
                        </Text>
                        <Text
                          className="text-md text-[#393939] leading-5"
                          style={{fontFamily: fontFamily.nunitoRegular}}>
                          Duration: {scan.scanDuration} sites
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        removeScan(scan.id, scan?.notificationId);
                      }}>
                      <DeleteIcon />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View className="flex-1 bg-white mx-4 my-4">
              <Text
                className="text-center my-auto text-lg "
                style={{fontFamily: fontFamily.nunitoRegular}}>
                No Scheduled Scans Found...
              </Text>
            </View>
          )}
          <View className="bottom-[6px] left-0 right-0 mx-auto">
            <Pressable onPress={() => {
              setVisibleScanModal(true)
              }}>
              <AddScanIcon color={Colors['light'].themeOrange} />
            </Pressable>
          </View>
          <AddScanModal
            visible={visibleScanModal}
            onClose={() => setVisibleScanModal(false)}
          />
        </View>
      </AppTheme>
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
