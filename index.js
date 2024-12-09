/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";
import { navigationRef } from './app/navigation/NavigationRef';
PushNotification.configure({

    onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
    
        // process the notification
        const navigateToNotificationScreen = (notificationData) => {
            // Navigate to Notification screen with notification data
            if (navigationRef.isReady()) {
                navigationRef.navigate('RunScan', { notification });
              }
          };
      
          navigateToNotificationScreen(notification);
        // (required) Called when a remote is received or opened, or local notification is opened
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    
    requestPermissions: true,
    requestPermissions: Platform.OS === 'ios'
})
AppRegistry.registerComponent(appName, () => App);
