/**
 * @format
 */

import { Alert, AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import { navigationRef } from './app/navigation/NavigationRef';
import notifee, { EventType } from '@notifee/react-native';
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
        }, 2000); // Delay for navigation
      } else {
        console.log('Navigating immediately...',notification?.data);
        // navigationRef.navigate('RunScan', notification?.data);
        setTimeout(() => {
          console.log('Navigating to target screen...');
          navigationRef.navigate('RunScan', notification?.data);
        }, 4000); // Delay for navigation
      }
    }

    // Finish processing the notification
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // Register listener for local notifications
  requestPermissions: Platform.OS === 'ios',
});


if (Platform.OS === 'ios') {
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
      }
    })
    .catch((error) => {
      console.error('Error fetching initial notification:', error);
    });


    PushNotificationIOS.addEventListener("localNotification", (notification) => {
      console.log('Local on Press notification received:', notification);
    })

    PushNotificationIOS.addEventListener("notification", (notification) => {
      console.log('Local on Press notification received:', notification);
    })
}

// const headlessNotificationHandler = async (notification) => {
//   console.log('Notification received in killed state:', notification);
//   // Add logic to handle the notification when the app is killed
//   // You can use notification data to trigger actions like opening specific screens
// };

// // Register the background handler for killed state
// notifee.onBackgroundEvent(headlessNotificationHandler);

// // Register the app component for headless execution
// AppRegistry.registerHeadlessTask('notificationBackground', () => headlessNotificationHandler);

AppRegistry.registerComponent(appName, () => App);
