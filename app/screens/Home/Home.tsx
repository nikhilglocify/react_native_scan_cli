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
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import notifee, { AndroidImportance, EventType, TriggerType } from '@notifee/react-native';
import {useEffect, useMemo, useState} from 'react';
import {ScanIcon} from '../../components/ui/svgIcons/Scan';
import AddScanIcon from '../../components/ui/svgIcons/AddScanIcon';
import TimerIcon from '../../components/ui/svgIcons/TimerIcon';
import DeleteIcon from '../../components/ui/svgIcons/DeleteIcon';
import {useScanContext} from '../../../context/ScanContext';
import AddScanModal from '../../components/Scan/AddScanModal';
import { getScansLocally } from '../../helpers/asyncStorage';
import { createNotificationChannel } from '../../services/PushNotificationConfig';
import { Notifications } from 'react-native-notifications';
export default function HomeScreen({navigation}:any) {
  const [visibleScanModal, setVisibleScanModal] = useState(false);
  const {
    scans,
   
    removeScan,
    getScheduledScans,
    setScanList,
    updatedScanList,
  
    checkForScan,
    setCheckForScan,
  } = useScanContext();
  const BACKGROUND_FETCH_TASK = 'background-fetch-task';
  const scheduledScans = useMemo(() => getScheduledScans(), [scans,updatedScanList]);


  useEffect(() => {
    const fetchScans = async () => {
      
      setScanList(scans||[]);


      // createNotificationChannel();
    };
    fetchScans();

  }, []);

  useEffect(() => {

    async function createChannel() {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH, // High importance
      });
    }

    createChannel(); 
    // Register foreground event listener
    const unsubscribeForeground = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.DELIVERED) {
        console.log('Notification Delivered in Foreground:', detail.notification);
        Alert.alert('Notification Delivered', 'A scheduled notification was received in the foreground!');
      }

      if (type === EventType.PRESS) {
        console.log('Notification Delivered in Foreground:', detail.notification);
        Alert.alert('PRESS Foreground', 'A scheduled notification was received in the foreground!');
      }

      if(type==EventType.UNKNOWN){
        console.log('Notification Unknown in Foreround:', detail.notification);
        Alert.alert('Notification Unknown in Foreround', detail?.notification?.body || 'No message');
      }
    });

    // Register background event listener
    // notifee.onBackgroundEvent(async ({ type, detail }) => {
    //   if (type === EventType.DELIVERED) {
    //     console.log('Notification Delivered in Background:', detail.notification);
    //     // Handle the background notification logic here
    //     // You can use the notification data to perform background tasks
    //     Alert.alert('Notification Delivered in Background', detail?.notification?.body || 'No message');
    //   }

    //   if (type === EventType.PRESS){
    //     console.log('Notification Pressed in Background:', detail.notification);

    //     navigation.navigate('RunScan');

    //   }
    //   if(type==EventType.UNKNOWN){
    //     console.log('Notification Unknown in Background:', detail.notification);
    //     Alert.alert('Notification Unknown in Background', detail?.notification?.body || 'No message');
    //   }
    // });

    // Clean up the foreground listener when the component unmounts
    return () => {
      // unsubscribeForeground(); // Only unsubscribe foreground listener
    };
  }, []);


  

  return (
    <>
      <View className="flex-1 h-screen mt-[80px]">
      
          <View className="px-4">
            <View className="flex flex-row items-center justify-between mb-9">
              <Text className="text-2xl font-medium">Scheduled Scans</Text>

              <Pressable
                onPress={() => {
                  navigation.navigate("RunScan",{scanNow:true})
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
                    <TouchableOpacity onPress={() => {
                      removeScan(scan.id,scan?.notificationId)
                      }}>
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
