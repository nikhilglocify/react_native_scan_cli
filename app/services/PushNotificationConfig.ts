import PushNotification, { PushNotificationScheduleObject } from 'react-native-push-notification';

// Function to schedule a notification
export const scheduleNotification = (
  title: string,
  message: string,
  date: Date
): void => {
  const notificationOptions: PushNotificationScheduleObject = {
    channelId: "default-channel-id", // Required for Android
    title: title, // Notification title
    message: message, // Notification message
    date: date, // Schedule time (guaranteed to be a Date object)
    allowWhileIdle: true, // Allow notification in idle mode
  };

  PushNotification.localNotificationSchedule(notificationOptions);
};

export const localNotification = (
    title: string,
    message: string,
    date?: Date
  ): void => {
    const notificationOptions: any = {
      channelId: "default-channel-id", // Required for Android
      title: title, // Notification title
      message: message, // Notification message
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
