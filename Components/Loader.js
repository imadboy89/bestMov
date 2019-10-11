import React from 'react';
import { StyleSheet, ActivityIndicator, View  } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height:600,
  },
  horizontal: {
    //flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
});

let loader  = (      
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#00ff00" />
    </View>);

export default loader;