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
import {Alert, useColorScheme} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
// Define the types for the navigation
export type RootTabParamList = {
  Home: undefined;

  History: undefined;

  Tips: undefined;
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
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].white,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].lightBlue,
        headerShown: false,
       
        tabBarLabelStyle: {
          marginTop: 4, // Adjust spacing between the label and icon
          fontSize: 14, // Optional: Adjust label size
          
        },
        tabBarStyle: {
          backgroundColor: '#8C46A9',
          height: 70, // Set background color for other platforms
          paddingBottom: 20, // Adjust padding to avoid overlapping with the tab bar

        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => <TabHistoryIcon />,
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => <TabHistoryIcon />,
        }}
      />
      <Tab.Screen
        name="Tips"
        component={Tips}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => <TabHistoryIcon />,
        }}
      />
    </Tab.Navigator>
  );
};

import {PermissionsAndroid, Platform} from 'react-native';
import {Linking} from 'react-native';
import {navigationRef} from './app/navigation/NavigationRef';



export const checkPostNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      // Check if POST_NOTIFICATIONS permission is granted
      const permissionStatus = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (permissionStatus) {
        console.log('POST_NOTIFICATIONS permission already granted.');
        return;
      } else {
        // If permission is not granted, request permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Post Notification Permission',
            message:
              'This app requires notification permissions to send you alerts and updates.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('POST_NOTIFICATIONS permission granted.');
        } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
          console.log('POST_NOTIFICATIONS permission denied.');
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          console.log(
            'POST_NOTIFICATIONS permission denied permanently. Redirecting to settings.'
          );
          Linking.openSettings(); // Open the app's settings
        }
      }
    } catch (err) {
      console.error('Error checking or requesting POST_NOTIFICATIONS permission:', err);
      // Redirect to settings as a fallback in case of an error
      Linking.openSettings();
    }
  } else {
    console.log('Permission not required for this Android version.');
  }
};

const App: React.FC = () => {
  useEffect(() => {
    checkPostNotificationPermission();
  }, []);

 
  return (
    <ScanProvider>
      <NavigationContainer ref={navigationRef}>
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
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ScanProvider>
  );
};

export default App;
