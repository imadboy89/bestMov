import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen  from "./Pages/Home";
import MovieScreen from "./Pages/Movie"
import WebViewScreen from "./Pages/webView"



console.disableYellowBox = true;
const AppNavigator = createStackNavigator(
  {
    Home      : HomeScreen,
    Movie     : MovieScreen,
    WebViewer : WebViewScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

export default createAppContainer(AppNavigator);
