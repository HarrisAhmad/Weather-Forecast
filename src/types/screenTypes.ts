import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export interface IScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export interface IWeatherDataArrayProps {
  id: number;
  day: string;
  temprature: number;
  weather: string;
}

export interface IFireStoreLocationDataProps {
  ID: number;
  Latitude: string;
  Longitude: string;
  PersonID: number;
}
