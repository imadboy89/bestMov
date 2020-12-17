import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import HomeScreen  from "./Pages/Home";
import MovieScreen from "./Pages/Movie";
import WebViewScreen from "./Pages/webView";
import SettingsScreen from "./Pages/Settings";
import Watch_WVScreen from "./Pages/Watch_WV";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



console.disableYellowBox = true;
const AppNavigator = createStackNavigator();

function MyStack() {
  return (
    <AppNavigator.Navigator>
      <AppNavigator.Screen name="Home" component={HomeScreen} />
      <AppNavigator.Screen name="Movie" component={MovieScreen} />
      <AppNavigator.Screen name="WebViewer" component={WebViewScreen} />
      <AppNavigator.Screen name="Settings" component={SettingsScreen} />
      <AppNavigator.Screen name="Watch_WV" component={Watch_WVScreen} />
    </AppNavigator.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
