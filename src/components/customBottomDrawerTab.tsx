import React, {FC} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {ICustomBottomDrawerTabProps} from '../types/componentType';

const CustomBottomDrawerTab: FC<ICustomBottomDrawerTabProps> = props => {
  const goToLocationScreen = async () => {
    props.navigation.navigate('Location Screen', {screen: 'LocationScreen'});
  };
  return (
    <View style={styles.mainContainer}>
      <DrawerContentScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.drawerItemListContainer}>
          <DrawerItemList {...props} />
          <View style={styles.scrollContainerStyle}>
            <TouchableOpacity onPress={() => goToLocationScreen()}>
              <View style={styles.locationContainerStyle}>
                <Text style={styles.locationTextStyle}>Saved Locations</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {flex: 1},
  contentContainer: {backgroundColor: '#EDA640'},
  drawerItemListContainer: {flex: 1, backgroundColor: '#fff', paddingTop: 10},
  backgroundStyle: {padding: 20, backgroundColor: 'orange'},
  nameTextStyle: {
    color: 'black',
    fontSize: 20,
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 5,
  },
  locationTextStyle: {
    fontSize: 15,
    marginLeft: 5,
  },
  scrollContainerStyle: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  locationContainerStyle: {flexDirection: 'row', alignItems: 'center'},
});

export default CustomBottomDrawerTab;
