import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import DrawerFlow from './src/router/drawerNav';

const App = () => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <NavigationContainer>
        <DrawerFlow />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});

export default App;
