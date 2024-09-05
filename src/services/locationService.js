import {PermissionsAndroid} from 'react-native';

// Accessing Permission
export const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Weather App',
        message: 'Weather App need access to your location to work properly',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //  console.log('You can use the location');
      return true;
    } else {
      console.log('location permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
};
