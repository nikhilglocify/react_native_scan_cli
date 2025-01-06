import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import notifee, {
    AndroidImportance,
    EventType,
    TriggerType,
  } from '@notifee/react-native';

const useHandleNotifiactionAction = ({navigation}: any) => {
    useEffect(() => {

        console.log(" useHandleNotifiactionAction Refactor code hook running ",navigation)
        // Register foreground event listener
        const unsubscribeForeground = notifee.onForegroundEvent(
          async ({type, detail}) => {
            if (type === EventType.ACTION_PRESS && detail?.pressAction?.id) {
              const actionId = detail?.pressAction?.id;
              
              console.log(
                'Foreground User pressed an action with the id: ',
                detail.pressAction.id,
                detail.notification?.data,
              );
              setTimeout(() => {
                if (actionId === 'open_now' || actionId == 'default') {
                  
                  navigation.navigate('RunScan', detail.notification?.data);
                 
                }
              }, 1000);
            }
    
            if (type === EventType.PRESS) {
              console.log(
                'Notification PRESS IOs in Foreground:',
                detail.notification,
              );
    
              // Check which action was pressed (Open Now or Ignore)
              const actionId = detail?.pressAction?.id;
              console.log('actionId', actionId);
              setTimeout(() => {
                if (actionId === 'open_now' || actionId == 'default') {
                  // Handle "Open Now" action
                  navigation.navigate('RunScan', detail.notification?.data);
                 
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
              if (actionId === 'open_now' || actionId == 'default') {
                // Handle "Open Now" action
                navigation.navigate('RunScan', detail.notification?.data);
              }
            }, 1000);
          }
    
          if (type === EventType.PRESS) {
            console.log(
              'Notification  EventType.PRESS Pressed in Background:',
              detail.notification,
            );
    
            // Check which action was pressed (Open Now or Ignore)
            const actionId = detail?.pressAction?.id;
    
            setTimeout(() => {
              if (actionId === 'open_now' || actionId == 'default') {
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
}

export default useHandleNotifiactionAction

const styles = StyleSheet.create({})