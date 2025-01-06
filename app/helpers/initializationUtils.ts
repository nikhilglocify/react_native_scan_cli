import notifee, {AuthorizationStatus} from '@notifee/react-native';

export async function requestUserPermission() {

    console.log("running requestUserPermission util ")
    const settings = await notifee.requestPermission();
  
    if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
      console.log('User denied permissions request');
    } else if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
      console.log('User granted permissions request');
    } else if (settings.authorizationStatus === AuthorizationStatus.PROVISIONAL) {
      console.log('User provisionally granted permissions request');
    }
  }
  export async function registerNotificationCategories() {
    console.log("running registerNotificationCategories util ")
    await notifee.setNotificationCategories([
      {
        id: 'scan_actions', 
        actions: [
          {
            id: 'open_now',
            title: 'Run Now',
            foreground: true, 
          },
          {
            id: 'ignore',
            title: 'Ignore',
            foreground: false, 
            destructive: true, 
          },
        ],
      },
    ]);
  }