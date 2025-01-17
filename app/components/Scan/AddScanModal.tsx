import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';

import Svg, {Path, Rect, Mask, G} from 'react-native-svg';

import uuid from 'react-native-uuid';

import {ScheduledScan} from '../../constants/Interface';
import {useScanContext} from '../../../context/ScanContext';
import ClockIcon from '../ui/svgIcons/ClockIcon';
import {
  scheduleNotifeeNotification,
  scheduleNotification,
} from '../../services/PushNotificationConfig';



import {fontFamily} from '../../constants/theme';
import CustomTimePicker from './CustomTimePicker';
import {Colors} from '../../constants/Colors';
import { canScheduleNewScan } from '../../helpers/asyncStorage';

const AddScanModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const [time, setTime] = useState<Date | null>(new Date());
  const [scanDuration, setScanDuration] = useState(10);
  const {addScan} = useScanContext();



  const onChangeTime = (selectedTime?: Date) => {
    if (selectedTime) setTime(selectedTime);
  };

  const resetState = () => {
    setTimeout(() => {
      setTime(null);
      setScanDuration(10);
    }, 1000);
  };

  // const scheduleNotifeeNotification = async (data: any, date: Date) => {
  //   try {
  //     console.log('scheduleNotifeeNotification', data);
  //     const trigger: TimestampTrigger = {
  //       type: TriggerType.TIMESTAMP,
  //       timestamp: date.getTime(), // trigger time
  //       repeatFrequency: RepeatFrequency.DAILY,
  //     };

  //     // Create the notification with action buttons for both iOS and Android
  //     await notifee.createTriggerNotification(
  //       {
  //         id: data?.id,
  //         data,
  //         title: 'Schedule Scan',
  //         body: `Click to start scan for ${data.scanDuration} sites `,
  //         android: {
  //           channelId: 'default',
  //           pressAction: {
  //             id: notifiactionActions.default,
  //             launchActivity: 'default',
  //           },
  //           actions: [
  //             {
  //               title: 'Run Now',
  //               pressAction: {
  //                 id: notifiactionActions.open_now,
  //                 launchActivity: 'default',
  //               },
  //             },
  //             {
  //               title: 'Ignore',
  //               pressAction: {
  //                 id: notifiactionActions.ignore,
  //                 launchActivity: 'default',
  //               },
  //             },
  //           ],
  //         },
  //         ios: {
  //           categoryId: 'scan_actions', // Category for iOS actions
  //         },
  //       },
  //       trigger,
  //     );
  //   } catch (error) {
  //     console.log('Error creating notification', error);
  //   }
  // };
  // const handleScheduleNotification = async (
  //   id: string,
  //   date: Date,
  //   data: ScheduledScan,
  // ) => {
  //   scheduleNotification(
  //     id,
  //     'Schedule Scan',
  //     `Click to start scan for ${data.scanDuration} sites `,
  //     date,
  //     data,
  //   );
  //   await setItem('NotificationIdCounter', id.toString());
  // };

  const handleAddScan = async () => {
    console.log('timeState', time);
    const scanTime = time ? time : new Date();
    console.log('scanTime', scanTime.toLocaleTimeString());

  const canSchedule= await  canScheduleNewScan(scanTime.toISOString())
  console.log("canSchedule",canSchedule)
    if (!canSchedule) {
      Alert.alert('Cannot schedule the scan','Ensure at least 90 seconds gap from existing scans.');
      return false;
    }
    const obj: ScheduledScan = {
      id: uuid.v4(),
      time: scanTime.toISOString(),
      date: scanTime,
      scanDuration,
      type: 'scheduled',
    };

    await addScan(obj);
    // handleScheduleNotification(notificationId, scanTime, obj);
    scheduleNotifeeNotification(obj, scanTime);
    // await scheduleNotifeeNotification(time)
    onClose();
    resetState();
  };

  return (
    <Modal
      transparent={false}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View
            // style={{backgroundColor: Colors['light'].themeOrange}}
            className="py-2 px-8 mb-6 rounded-sm">
            <Text
              className="text-xl text-center mb-2"
              style={{fontFamily: fontFamily.nunitoSemiBold}}>
              Select Time
            </Text>
          </View>
          <CustomTimePicker onTimeChange={onChangeTime} />

          <View className="mt-[36px] mb-[36px] flex flex-row items-center gap-2">
            <Text
              className="text-base text-[#393939] font-semibold leading-5"
              style={{fontFamily: fontFamily.nunitoBold}}>
              Scan Duration:
            </Text>
            <View className="flex items-center flex-row justify-between px-3 p-1 text-left bg-[#ECECEC] border-[1.5px] border-solid border-[#8C46A9]/15 rounded-lg relative min-w-[80px] h-[72px] max-w-[65px]">
              <Text className="text-[18px] inline-block">{scanDuration}</Text>
              <View className="flex flex-col gap-5 justify-end text-right">
                {/* up arrow */}

                <Pressable
                  onPress={() => {
                    if (scanDuration < 20) {
                      setScanDuration(prev => prev + 1);
                    }
                  }}>
                  <View className="py-1">
                    <Svg width="18" height="18" viewBox="0 0 5 4" fill="none">
                      <Path
                        d="M0.250151 4L4.75028 4C4.79584 3.99985 4.8405 3.98642 4.87945 3.96116C4.9184 3.93591 4.95017 3.89978 4.97133 3.85666C4.9925 3.81355 5.00226 3.76508 4.99956 3.71648C4.99687 3.66789 4.98182 3.62099 4.95603 3.58085L2.70597 0.107993C2.61272 -0.0359975 2.38821 -0.0359975 2.29471 0.107993L0.0446447 3.58085C0.0186002 3.62091 0.00332707 3.66783 0.000484745 3.71651C-0.00235758 3.76519 0.00733961 3.81377 0.0285227 3.85697C0.0497059 3.90018 0.0815647 3.93635 0.120638 3.96157C0.159711 3.98678 0.204504 4.00008 0.250151 4Z"
                        fill="#464646"
                        fill-opacity="0.45"
                      />
                    </Svg>
                  </View>
                </Pressable>

                {/* down arrow */}
                <Pressable
                  onPress={() => {
                    console.log('scanDurection', scanDuration);
                    if (scanDuration > 5) {
                      setScanDuration(prev => prev - 1);
                    }
                  }}>
                  <View className="py-1">
                    <Svg width="18" height="18" viewBox="0 0 5 4" fill="none">
                      <Path
                        d="M4.74985 6.93387e-07L0.249721 2.99973e-07C0.20416 0.000152884 0.1595 0.0135806 0.120549 0.0388372C0.0815977 0.0640939 0.0498303 0.100223 0.0286664 0.143337C0.00750241 0.18645 -0.00225702 0.234916 0.000439015 0.283515C0.00313457 0.332114 0.0181835 0.379008 0.0439657 0.419148L2.29403 3.89201C2.38728 4.036 2.61179 4.036 2.70529 3.89201L4.95536 0.419148C4.9814 0.379092 4.99667 0.332175 4.99952 0.283494C5.00236 0.234814 4.99266 0.186232 4.97148 0.143027C4.95029 0.0998225 4.91844 0.0636465 4.87936 0.0384309C4.84029 0.0132153 4.7955 -7.5835e-05 4.74985 6.93387e-07Z"
                        fill="#464646"
                      />
                    </Svg>
                  </View>
                </Pressable>
              </View>
            </View>
            <Text
              className="text-base text-[#393939] font-semibold leading-5"
              style={{fontFamily: fontFamily.nunitoBold}}>
              Sites
            </Text>
          </View>

          <View className="w-full flex flex-row items-center justify-between my-auto">
            <ClockIcon />

            {/* Action Buttons */}

            <View className="flex items-center flex-row gap-2">
              <TouchableOpacity
                className="bg-[#ECECEC]  py-3 min-w-[86px] rounded-sm"
                onPress={() => {
                  onClose();

                  resetState();
                }}>
                <Text
                  className="text-center text-base text-[#393939] font-semibold leading-6"
                  style={{fontFamily: fontFamily.nunitoBold}}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{backgroundColor: Colors['light'].themeOrange}}
                className="   py-3 min-w-[86px] rounded-sm"
                onPress={() => {
                  handleAddScan();
                }}>
                <Text
                  className="text-center text-base text-white font-semibold leading-6"
                  style={{fontFamily: fontFamily.nunitoBold}}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddScanModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 350,
    height: 450,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    // fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: fontFamily.nunitoSemiBold,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  picker: {
    width: 100,
    height: 44,
  },
  unit: {
    fontSize: 16,
    marginLeft: 10,
  },
});
