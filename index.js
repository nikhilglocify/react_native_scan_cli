/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { navigationRef } from './app/navigation/NavigationRef';

import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
PushNotification.configure({
    
    onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);


    if (notification.foreground){
        console.log("FOREGORUN NOTIFIACTON",notification)
    }

    navigationRef.navigate("RunScan")

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);



  },
  requestPermissions: Platform.OS === 'ios',

  
})

AppRegistry.registerComponent(appName, () => App);
