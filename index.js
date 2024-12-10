/**
 * @format
 */

import { Alert, AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import { navigationRef } from './app/navigation/NavigationRef';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function (notification) {
    // console.log('NOTIFICATION:', notification);
  
    if (notification.foreground) {
      console.log('FOREGROUND NOTIFICATION:', notification);
    }

    if (notification.userInteraction) {
      if (!navigationRef || !navigationRef.isReady()) {
        console.log('Navigation not initialized. Storing pending navigation.');
        const pendingNavigation = notification; // Store the intent
        setTimeout(() => {
          console.log('Navigating to target screen...');
          navigationRef.navigate('RunScan', notification?.data);
        }, 4000); // Delay for navigation
      } else {
        console.log('Navigating immediately...');
        navigationRef.navigate('RunScan', notification?.data);
      }
    }

    // Finish processing the notification
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // Register listener for local notifications
  requestPermissions: Platform.OS === 'ios',
});


PushNotificationIOS.getInitialNotification()
  .then((notification) => {
    if (notification) {
      console.log('App launched by notification:', notification);

     
      if (!navigationRef || !navigationRef.isReady()) {
        console.log('Navigation not initialized. Storing pending navigation.');
        const pendingNavigation = notification; // Store the intent
        setTimeout(() => {
          console.log('Navigating to target screen...');
          navigationRef.navigate('RunScan', notification?._data);
        }, 2000); // Delay for navigation
      } else {
        console.log('Navigating immediately...');
        navigationRef.navigate('RunScan', notification?._data);
      }
  }})
  .catch((error) => {
    console.error('Error fetching initial notification:', error);
  });



AppRegistry.registerComponent(appName, () => App);
