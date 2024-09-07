import {PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetDate = (): string => {
  let currentDate = '';
  const dateTime = new Date();

  const date = ('0' + dateTime.getDate()).slice(-2);
  const month = ('0' + (dateTime.getMonth() + 1)).slice(-2);
  const year = dateTime.getFullYear();

  var hours = dateTime.getHours();
  let minutes = dateTime.getMinutes();
  var seconds = dateTime.getSeconds();

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const min = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + min;
  const actualDate = year + '-' + month + '-' + date + ' ' + strTime;
  return actualDate;
};

// Setting Drawer with no back nav
export const SaveAsyncStorage = async (key: string, status: string) => {
  try {
    await AsyncStorage.setItem(key, status);
  } catch (e) {
    console.error('Failed to save data' + e);
  }
};

export const GetAsyncStorageData = async (
  key: string,
): Promise<string | null> => {
  let data: string | null = null;
  try {
    await AsyncStorage.getItem(key).then(id => {
      data = id;
      return data;
    });
  } catch (e) {
    console.log('Failed to get data from storage');
  }
  return data;
};

// Accessing Permission
export const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Weather App',
        message: 'Weather App need access to your location to work properly',
        buttonNeutral: 'Ask Me Later',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      console.log('location permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
};
