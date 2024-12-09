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
import {useColorScheme} from 'react-native';
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
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          marginTop: 4, // Adjust spacing between the label and icon
          fontSize: 14, // Optional: Adjust label size
        },
        tabBarStyle: {
          backgroundColor: '#8C46A9',
          height: 60, // Set background color for other platforms
        },
      }}
      // screenOptions={{
      //   tabBarStyle: {
      //     backgroundColor: '#f8f8f8', // Add your desired background color
      //     borderTopWidth: 0, // Optional: Remove top border for a cleaner look
      //     height: 70, // Adjust the height if needed
      //   },
      //   tabBarActiveTintColor: '#4CAF50', // Color for active tab icons and text
      //   tabBarInactiveTintColor: '#757575', // Color for inactive tab icons and text
      // }}
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
export const checkExactAlarmPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 31) {
    console.log(
      'SCHEDULE_EXACT_ALARM permission cannot be checked programmatically.',
    );
    console.log('Redirecting user to app settings for manual grant.');
    Linking.openSettings(); // Open the app's settings
  } else {
    console.log('Permission not required for this Android version.');
  }
};

// Function to check and request the permission
export const checkAndRequestExactAlarmPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 31) {
    try {
      // Check if permission is granted
      const isGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.SCHEDULE_EXACT_ALARM,
      );

      if (!isGranted) {
        console.log('SCHEDULE_EXACT_ALARM not granted. Directing to settings.');
        Linking.openSettings(); // Open app settings for manual permission grant
      } else {
        console.log('SCHEDULE_EXACT_ALARM permission granted.');
      }
    } catch (error) {
      console.error('Error checking or requesting permission:', error);
    }
  } else {
    console.log('Permission not required for this Android version.');
  }
};

const App: React.FC = () => {
  useEffect(() => {
    checkExactAlarmPermission();
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
