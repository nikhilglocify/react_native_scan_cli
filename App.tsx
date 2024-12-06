/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import "react-native-gesture-handler";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './app/screens/Home/Home';
import History from './app/screens/History/History';



// Define the types for the navigation
export type RootTabParamList = {
  Home: undefined;
 
  History: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen name="Home" component={Home} options={{headerShown:false}} />
        <Tab.Screen name="History" component={History} options={{headerShown:false}} />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
