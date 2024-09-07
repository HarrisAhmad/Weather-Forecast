import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import firestore, {doc} from '@react-native-firebase/firestore';
import {GetReverseGeocode} from '../services/apiService';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {IAddressProps, IReverseGeocodeResponse} from '../types/apiServiceType';
import {IFireStoreLocationDataProps} from '../types/screenTypes';

const LocationScreen = () => {
  const [locationList, setLocationlist] = useState<IAddressProps[]>([]);
  const usersCollection = firestore().collection('WeatherForecast');
  let addressArray = [];

  useFocusEffect(
    useCallback(() => {
      getUserLocation();
    }, []),
  );

  const getUserLocation = async () => {
    let dataArray: IFireStoreLocationDataProps[] = [];

    // Fetching data from firestore
    const locationData = await usersCollection.get();
    locationData.forEach(docSnapshot => {
      dataArray.push(docSnapshot.data() as IFireStoreLocationDataProps); // Type casting
    });

    for (let i = 0; i < dataArray.length; i++) {
      let result = await GetReverseGeocode(
        dataArray[i].Latitude,
        dataArray[i].Longitude,
      );
      if (result !== null) {
        let addressObj = {
          id: dataArray[i].ID,
          state: result.address.state,
          town: result.address.town,
        };
        addressArray.push(addressObj);
      }
      console.log(addressArray);
      setLocationlist(addressArray);
    }
  };

  const renderItem = (item: IAddressProps) => {
    return (
      <View style={styles.addressListContainer}>
        <Text style={styles.addressTextStyle}>
          {item.town}, {item.state}
        </Text>
      </View>
    );
  };

  const renderSeparator = () => {
    return <View style={styles.rowSepratorStyle} />;
  };

  return (
    <View style={styles.mainConatiner}>
      <View style={styles.addressConatiner}>
        <FlatList
          style={styles.mainConatiner}
          data={locationList}
          keyExtractor={(item, index) => item + index.toString()}
          renderItem={({item}) => renderItem(item)}
          ItemSeparatorComponent={renderSeparator}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainConatiner: {flex: 1},
  addressConatiner: {
    flex: 0.4,
    marginHorizontal: 5,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  addressListContainer: {
    flex: 1,
  },
  rowSepratorStyle: {
    padding: 10,
    height: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  addressTextStyle: {
    paddingLeft: 10,
    paddingTop: 10,
    fontSize: 18,
    textAlign: 'left',
    color: '#000000',
    fontWeight: 'normal',
  },
});

export default LocationScreen;
