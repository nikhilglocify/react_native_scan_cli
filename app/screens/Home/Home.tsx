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

import notifee, {
  AndroidImportance,
  EventType,
  TriggerType,
} from '@notifee/react-native';
import {useEffect, useMemo, useState} from 'react';
import {ScanIcon} from '../../components/ui/svgIcons/Scan';
import AddScanIcon from '../../components/ui/svgIcons/AddScanIcon';
import TimerIcon from '../../components/ui/svgIcons/TimerIcon';
import DeleteIcon from '../../components/ui/svgIcons/DeleteIcon';
import {useScanContext} from '../../../context/ScanContext';
import AddScanModal from '../../components/Scan/AddScanModal';
import {getScansLocally, setItem} from '../../helpers/asyncStorage';
import {createNotificationChannel} from '../../services/PushNotificationConfig';
// import { Notifications } from 'react-native-notifications';
import {Scan} from '../../constants/enums';
import {fontFamily} from '../../constants/theme';
import Loader from '../../components/ui/Loader';
export default function HomeScreen({navigation}: any) {
  const [visibleScanModal, setVisibleScanModal] = useState(false);
  const [loading,setLoading]=useState(true)
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

  useEffect(() => {
    createNotificationChannel();
    setTimeout(()=>{
      setLoading(false)
    },1200)
  }, []);
  useEffect(() => {
    async function createChannel() {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH, // High importance
        sound: 'hollow',
      });
    }

    createChannel();

    // Register foreground event listener
    const unsubscribeForeground = notifee.onForegroundEvent(
      async ({type, detail}) => {
      
        if (type === EventType.ACTION_PRESS && detail?.pressAction?.id) {
          const actionId = detail?.pressAction?.id;
          // Alert.alert('Foreground Pressed');
          console.log(
            'Foreground User pressed an action with the id: ',
            detail.pressAction.id,
            detail.notification?.data,
          );
          setTimeout(() => {
            if (actionId === 'open_now' ||actionId == 'default') {
              // Handle "Open Now" action
              navigation.navigate('RunScan', detail.notification?.data);
              // Alert.alert('Scan Opened', 'You have accepted the scan request.');
            } 
          }, 1000);
        }

        if (type === EventType.PRESS) {
          console.log('Notification PRESS IOs in Foreground:', detail.notification);

          // Check which action was pressed (Open Now or Ignore)
          const actionId = detail?.pressAction?.id;
          console.log("actionId",actionId)
          setTimeout(() => {
            if (actionId === 'open_now' ||actionId == 'default') {
              // Handle "Open Now" action
              navigation.navigate('RunScan', detail.notification?.data);
              // Alert.alert('Scan Opened', 'You have accepted the scan request.');
            } 
          }, 1000);
        }
      },
    );

    // Register background event listener
    notifee.onBackgroundEvent(async ({type, detail}) => {
      
      if (type === EventType.ACTION_PRESS && detail?.pressAction?.id) {
        console.log(
          'Background User pressed an action with the id: ',
          detail.pressAction.id,
        );
        const actionId = detail?.pressAction?.id;
        setTimeout(() => {
          if (actionId === 'open_now' ||actionId == 'default') {
            // Handle "Open Now" action
            navigation.navigate('RunScan', detail.notification?.data);
            
          } 
        }, 1000);
      }

      if (type === EventType.PRESS) {
        console.log('Notification  EventType.PRESS Pressed in Background:', detail.notification);

        // Check which action was pressed (Open Now or Ignore)
        const actionId = detail?.pressAction?.id;
        
        setTimeout(() => {
          if (actionId === 'open_now' ||actionId == 'default') {
            // Handle "Open Now" action
            navigation.navigate('RunScan', detail.notification?.data);
            // Alert.alert('Scan Opened', 'You have accepted the scan request.');
          } 
        }, 1000);
      }
    });

    // Clean up the foreground listener when the component unmounts
    return () => {
      unsubscribeForeground(); // Unsubscribe from the foreground listener
    };
  }, []);


  if(loading){
    return <Loader/>
  }
  return (
    <>
      <View className="flex-1 h-screen mt-[80px]">
        <View className="px-4">
          <View className="flex flex-row items-center justify-between mb-9">
            <Text
              className="text-2xl font-medium"
              style={{fontFamily: fontFamily.nunitoSemiBold}}>
              Scheduled Scans
            </Text>

            <Pressable
              onPress={() => {
                navigation.navigate('RunScan', {scanNow: true});
                setCheckForScan(!checkForScan);
              }}>
              <ScanIcon />
            </Pressable>
          </View>
        </View>{' '}
        {scheduledScans.length > 0 ? (
          <ScrollView className="p-4 mb-[36px] pb-10">
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
          <Text
            className="text-center my-auto text-lg"
            style={{fontFamily: fontFamily.nunitoRegular}}>
            No Scheduled Scans Found...
          </Text>
        )}
        <View className="absolute bottom-[2px] right-[24px]">
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
