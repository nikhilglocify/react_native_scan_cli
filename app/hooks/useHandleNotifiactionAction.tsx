import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import notifee, {
  AndroidImportance,
  EventType,
  TriggerType,
} from '@notifee/react-native';
import { notifiactionActions } from '../constants/enums';

const useHandleNotifiactionAction = ({navigation}: any) => {
  const handleNotificationAction = (
    actionId: string,
    notificationData: any,
    navigation: any,
  ) => {
    console.log('ACTION_ID=>', actionId);
    if (actionId) {
      setTimeout(() => {
        if (actionId === notifiactionActions.open_now || actionId == notifiactionActions.default) {
          navigation.navigate('RunScan', notificationData);
        }
      }, 1000);
    }
  };

  useEffect(() => {
    console.log(
      'useHandleNotifiactionAction Refactor code hook running ',
      navigation,
    );
    // Register foreground event listener
    const unsubscribeForeground = notifee.onForegroundEvent(
      async ({type, detail}) => {
        if (type === EventType.ACTION_PRESS && detail?.pressAction?.id) {
          console.log('Foreground Notifee EventType.ACTION_PRESS');
          const actionId = detail?.pressAction?.id;
          const notificationData = detail.notification?.data;
          handleNotificationAction(actionId, notificationData, navigation);
        }

        if (type === EventType.PRESS) {
          console.log('Foreground Notifee EventType.PRESS ');
          const actionId = detail?.pressAction?.id;
          const notificationData = detail.notification?.data;
          handleNotificationAction(actionId!, notificationData, navigation);
        }
      },
    );

    // Register background event listener
    notifee.onBackgroundEvent(async ({type, detail}) => {
      if (type === EventType.ACTION_PRESS && detail?.pressAction?.id) {
        console.log('Background Notifee EventType.ACTION_PRESS');
        const actionId = detail?.pressAction?.id;
        const notificationData = detail.notification?.data;
        handleNotificationAction(actionId!, notificationData, navigation);
      }

      if (type === EventType.PRESS) {
        console.log('Background Notifee  EventType.PRESS');
        const actionId = detail?.pressAction?.id;
        const notificationData = detail.notification?.data;
        handleNotificationAction(actionId!, notificationData, navigation);
      }
    });

    return () => {
      unsubscribeForeground(); // Unsubscribe from the foreground listener
    };
  }, []);
};

export default useHandleNotifiactionAction;

const styles = StyleSheet.create({});
