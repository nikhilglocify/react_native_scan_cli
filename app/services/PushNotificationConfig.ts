import PushNotification, { PushNotificationScheduleObject } from 'react-native-push-notification';
import { ScheduledScan } from '../constants/Interface';

// Function to schedule a notification
export const scheduleNotification = (
    id: string,
    title: string,
    message: string,
    date: Date,
    userInfo:ScheduledScan
): void => {
    const notificationOptions: PushNotificationScheduleObject = {
        id: id,
        channelId: "default-channel-id", 
        title: title, 
        message: message, 
        date: date, 
        allowWhileIdle: true, 
        vibrate:true, 
        vibration: 3000, 
        importance: "high", 
        priority: "high", 
        userInfo

    };

    PushNotification.localNotificationSchedule(notificationOptions);
};
export const deleteNotification = (id: string) => {
    console.log("deleteNotification function runnin",id)
    PushNotification.cancelLocalNotification(id); 
}
export const localNotification = (
    title: string,
    message: string,
    date?: Date
): void => {
    const notificationOptions: any = {
        channelId: "default-channel-id", // Required for Android
        title: title, // Notification title
        message: message, // Notification message
        testMessage:"fsafasfsafsf",
        userInfo: {
            scanId: "sdfsf",
            name: "test data",
            visitidUrks:["sfs","fsfs"],
            scanDuration:2
        
        }
        //   date: date, // Schedule time (guaranteed to be a Date object)
        //   allowWhileIdle: true, // Allow notification in idle mode
    };

    PushNotification.localNotification(notificationOptions);
};

// Function to create a notification channel (Android only)
export const createNotificationChannel = (): void => {
    PushNotification.createChannel(
        {
            channelId: "default-channel-id", // Unique ID
            channelName: "Default Channel", // Displayed channel name
        },
        (created: boolean) => console.log(`Channel created: ${created}`)
    );
};
