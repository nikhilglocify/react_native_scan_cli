/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import './global.css';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './app/screens/Home/Home';
import History from './app/screens/History/History';
import {ScanProvider} from './context/ScanContext';
import Tips from './app/screens/Tips/Tip';
import { createStackNavigator } from '@react-navigation/stack';
import RunScan from './app/components/Scan/RunScan';

// Define the types for the navigation
export type RootTabParamList = {
  Home: undefined;

  History: undefined;

  Tips:undefined
};
export type RootStackParamList = {
  Tabs: undefined; // For the Tab Navigator
  RunScan:undefined
};
const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Tips"
        component={Tips}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};
const App: React.FC = () => {
  return (
    <ScanProvider>
      <NavigationContainer>
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
