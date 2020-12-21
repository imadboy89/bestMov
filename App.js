import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import HomeScreen  from "./Pages/Home";
import MovieScreen from "./Pages/Movie";
import WebViewScreen from "./Pages/webView";
import SettingsScreen from "./Pages/Settings";
import Watch_WVScreen from "./Pages/Watch_WV";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


var app_styles = {
    screenHeader : {
      headerStyle: {
        backgroundColor: "#34495e",
        height: 50,
        },
      headerTintColor: "#e67e22",
      headerTitleStyle: {
        //fontWeight: 'bold',
        },
      headerTitleAlign: 'center'
      },
  }

console.disableYellowBox = true;
const AppNavigator = createStackNavigator();

function MyStack() {
  return (
    <AppNavigator.Navigator>
      <AppNavigator.Screen options={app_styles.screenHeader} name="Home" component={HomeScreen} />
      <AppNavigator.Screen options={app_styles.screenHeader} name="Movie" component={MovieScreen} />
      <AppNavigator.Screen options={app_styles.screenHeader} name="WebViewer" component={WebViewScreen} />
      <AppNavigator.Screen options={app_styles.screenHeader} name="Settings" component={SettingsScreen} />
      <AppNavigator.Screen options={app_styles.screenHeader} name="Watch_WV" component={Watch_WVScreen} />
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
