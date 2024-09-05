import React, {useState, useEffect, useRef} from 'react';
import firestore from '@react-native-firebase/firestore';
import {GetReverseGeocode} from '../services/apiService';
import {View, Text, FlatList, StyleSheet} from 'react-native';

const LocationScreen = () => {
  const [locationList, setLocationlist] = useState(null);
  const coords = useRef(null);
  const usersCollection = firestore().collection('WeatherForecast');
  let addressArray = [];
  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    let dataArray = [];

    await usersCollection.get().then(data => {
      data.forEach(docSnapshot => {
        dataArray.push(docSnapshot.data());
      });
    });

    for (let i = 0; i < dataArray.length; i++) {
      let result = await GetReverseGeocode(
        dataArray[i].Latitude,
        dataArray[i].Longitude,
      );
      let addressObj = {
        id: dataArray[i].ID,
        state: result.data.address.state,
        town: result.data.address.town,
      };
      addressArray.push(addressObj);
    }
    console.log(addressArray);
    setLocationlist(addressArray);
  };

  const renderItem = item => {
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
          style={{flex: 1}}
          data={locationList}
          keyExtractor={item => item.id.toString()}
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
