import PushNotification, { PushNotificationScheduleObject } from 'react-native-push-notification';
import { ScheduledScan } from '../constants/Interface';
import notifee, { AndroidImportance, RepeatFrequency, TimestampTrigger, TriggerType } from '@notifee/react-native';
import { notifiactionActions } from '../constants/enums';
import { Alert } from 'react-native';
// Function to schedule a notification
export const scheduleNotification = (
  id: string,
  title: string,
  message: string,
  date: Date,
  userInfo: ScheduledScan
): void => {
  const notificationOptions: PushNotificationScheduleObject = {
    id: id,
    channelId: "default-channel-id",
    title: title,
    message: message,
    date: date,
    allowWhileIdle: true,
    vibrate: true,
    vibration: 3000,
    importance: "high",
    priority: "high",
    userInfo

  };

  PushNotification.localNotificationSchedule(notificationOptions);
};
export const deleteNotifeeNotification = (id: string) => {
  console.log("deleteNotifeeNotification function runnin", id)
  notifee.cancelNotification(id);
}
export const deleteNotification = (id: string) => {
  console.log("deleteNotification function runnin", id)
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
    testMessage: "test local msg",
    userInfo: {
      scanId: "test scan_id",
      name: "test name",
      visitidUrls: ["sfs", "fsfs"],
      scanDuration: 2

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

export const createNotifeeNotificationChannel = async () => {
  console.log("Notife chaneel")
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH, // High importance
    sound: 'hollow',
  });
}


export const scheduleNotifeeNotification = async (data: any, date: Date) => {
  try {
    const current = new Date();
    let notificationTime = new Date(date); // Ensure `date` is a Date object
    if (current.getTime() > notificationTime.getTime()) {
      notificationTime.setDate(notificationTime.getDate() + 1);
     
    }
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: notificationTime.getTime(), // trigger time
      repeatFrequency: RepeatFrequency.DAILY,
    };

    // Create the notification with action buttons for both iOS and Android
    await notifee.createTriggerNotification(
      {
        id: data?.id,
        data,
        title: 'Schedule Scan',
        body: `Click to start scan for ${data.scanDuration} sites `,
        android: {
          channelId: 'default',
          pressAction: {
            id: notifiactionActions.default,
            launchActivity: 'default',
          },
          actions: [
            {
              title: 'Run Now',
              pressAction: {
                id: notifiactionActions.open_now,
                launchActivity: 'default',
              },
            },
            {
              title: 'Ignore',
              pressAction: {
                id: notifiactionActions.ignore,
                launchActivity: 'default',
              },
            },
          ],
        },
        ios: {
          categoryId: 'scan_actions', // Category for iOS actions
        },
      },
      trigger,
    );
  } catch (error: any) {
    console.log('Error creating notification', error.message);
  }
};
