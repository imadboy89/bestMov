import React from 'react';
import { StyleSheet, ActivityIndicator, View  } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height:800,
  },
  horizontal: {
    //flexDirection: 'row',
    height:"100%",
    justifyContent: 'space-around',
    padding: 10
  }
});

let loader  = (      
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#00ff00" />
    </View>);

export default loader;