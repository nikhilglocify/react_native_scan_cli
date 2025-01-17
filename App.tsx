/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import './global.css';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './app/screens/Home/Home';
import History from './app/screens/History/History';
import {ScanProvider} from './context/ScanContext';
import Tips from './app/screens/Tips/Tip';
import {createStackNavigator} from '@react-navigation/stack';
import RunScan from './app/components/Scan/RunScan';
import TabHistoryIcon from './app/components/ui/svgIcons/TabHistoryIcon';
import {Colors} from './app/constants/Colors';
import {ImageBackground, StyleSheet, useColorScheme} from 'react-native';
import notifee from '@notifee/react-native';
import {Platform} from 'react-native';
import {navigationRef} from './app/navigation/NavigationRef';
import {fontFamily} from './app/constants/theme';
import {FontAwesomeIcon, MaterialIcons} from './app/components/ui/TabIcons';
import {
  registerNotificationCategories,
  requestUserPermission,
} from './app/helpers/initializationUtils';
import {SafeAreaView} from 'react-native-safe-area-context';

// Define the types for the navigation
export type RootTabParamList = {
  Home: undefined;

  History: undefined;

  Tips: undefined;
  RunScan: undefined;
};
export type RootStackParamList = {
  Tabs: undefined; // For the Tab Navigator
  RunScan: undefined;
};
const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();
const TabNavigator: React.FC = () => {
  const colorScheme = useColorScheme();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].lightGray,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].white,
        headerShown: false,

        tabBarLabelStyle: {
          marginTop: 4, // Adjust spacing between the label and icon
          fontSize: 14, // Optional: Adjust label size
          fontFamily: fontFamily.nunitoSemiBold,
        },
        tabBarStyle: {
          // backgroundColor: '#8C46A9',
          backgroundColor: Colors['light'].themeOrange,
          height: 70, // Set background color for other platforms
          paddingBottom: 20, // Adjust padding to avoid overlapping with the tab bar
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          // tabBarStyle:{display:"flex"},
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon name="home" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          // tabBarStyle:{display:"flex"},
          headerShown: false,
          tabBarIcon: ({color, size}) => <TabHistoryIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Tips"
        component={Tips}
        options={{
          // tabBarStyle:{display:"flex"},
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon name="star" size={30} color={color} />
          ),
          tabBarLabel: 'Daily Tips',
        }}
      />
    </Tab.Navigator>
  );
};

// async function requestUserPermission() {
//   const settings = await notifee.requestPermission();

//   if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
//     console.log('User denied permissions request');
//   } else if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
//     console.log('User granted permissions request');
//   } else if (settings.authorizationStatus === AuthorizationStatus.PROVISIONAL) {
//     console.log('User provisionally granted permissions request');
//   }
// }
// async function registerNotificationCategories() {
//   await notifee.setNotificationCategories([
//     {
//       id: 'scan_actions', // This must match the `categoryId` in the notification
//       actions: [
//         {
//           id: 'open_now',
//           title: 'Run Now',
//           foreground: true, // Bring the app to the foreground
//         },
//         {
//           id: 'ignore',
//           title: 'Ignore',
//           foreground: false, // Do not bring the app to the foreground
//           destructive: true, // Mark as a destructive action (optional)
//         },
//       ],
//     },
//   ]);
// }

const App: React.FC = () => {
  useEffect(() => {
    requestUserPermission();
    checkInitalNotification();

    if (Platform.OS == 'ios') {
      registerNotificationCategories();
    }
  }, []);

  const checkInitalNotification = async () => {
    const initialNotification = await notifee.getInitialNotification();
    const actionId = initialNotification?.pressAction.id;

    setTimeout(() => {
      if (actionId == 'open_now' || actionId == 'default') {
        if (!navigationRef || !navigationRef.isReady()) {
          console.log(
            'Navigation not initialized. Storing pending navigation.',
          );

          setTimeout(() => {
            console.log('Navigating to target screen...');
            navigationRef.navigate(
              'RunScan',
              initialNotification?.notification.data,
            );
          }, 2000); // Delay for navigation
        } else {
          console.log('Navigating immediately...');
          navigationRef.navigate(
            'RunScan',
            initialNotification?.notification.data,
          );
        }
      }
    }, 2000);
  };

  return (
    <ScanProvider>
      <NavigationContainer ref={navigationRef}>
        <SafeAreaView style={{flex:1}}>
          <Stack.Navigator initialRouteName="Tabs">
            {/* Main Tab Navigator */}

            <Stack.Screen
              name="Tabs"
              component={TabNavigator}
              options={{headerShown: false}}
            />
            {/* Additional screens */}
            <Stack.Screen
              name="RunScan"
              component={RunScan}
              options={{
                headerShown: false,
                // tabBarStyle: { display: 'flex' }
              }}
            />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </ScanProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 2,
  },
});
