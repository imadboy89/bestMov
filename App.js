import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen  from "./Pages/Home";
import MovieScreen from "./Pages/Movie";
import WebViewScreen from "./Pages/webView";
import SettingsScreen from "./Pages/Settings";
import Watch_WVScreen from "./Pages/Watch_WV";



console.disableYellowBox = true;
const AppNavigator = createStackNavigator(
  {
    Home      : HomeScreen,
    Movie     : MovieScreen,
    WebViewer : WebViewScreen,
    Settings  : SettingsScreen,
    Watch_WV  : Watch_WVScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

export default createAppContainer(AppNavigator);
