import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

const LoadingIndicator = () => {
  return (
    <View style={styles.indicatorStyle}>
      <ActivityIndicator size="large" color={'#ffffff'} />
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorStyle: {
    flex: 0.5,
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingIndicator;
