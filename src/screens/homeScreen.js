import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';

import {requestLocationPermission} from '../services/locationService';
import {GetCurrentWeather, GetWeatherForecast} from '../services/apiService';

import LoadingIndicator from '../components/loadingIndicator';
import hexColors from '../assets/colors/hexColors';
import {
  GetDate,
  SaveAsyncStorage,
  GetAsyncStorageData,
} from '../common/commonFunctions';

const HomeScreen = props => {
  const [isLoading, setisLoading] = useState(true);
  const [permission, setPermission] = useState(false);
  const [location, setLocation] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [favourite, setFavourite] = useState(false);
  const [appbackgroundColor, setBackgorundColor] = useState(hexColors.sunny);
  const [weatherImage, setWeatherImage] = useState(
    require('../assets/Images/forest_sunny.png'),
  );

  const lat = useRef(null);
  const long = useRef(null);
  const weatherType = useRef(null);
  const mainTemp = useRef(null);
  const minTemp = useRef(null);
  const maxTemp = useRef(null);
  const favouriteID = useRef('');
  // Initializing firestore
  const usersCollection = firestore().collection('WeatherForecast');
  const weatherData = {
    coord: {lon: 31.2129, lat: -29.5271},
    weather: [{id: 800, main: 'Clouds', description: 'clear sky', icon: '01d'}],
    base: 'stations',
    main: {
      temp: 23.97,
      feels_like: 23.34,
      temp_min: 21.69,
      temp_max: 23.97,
      pressure: 1026,
      humidity: 35,
    },
    visibility: 10000,
    wind: {speed: 4.63, deg: 180},
    clouds: {all: 0},
    dt: 1681551449,
    sys: {
      type: 1,
      id: 1934,
      country: 'ZA',
      sunrise: 1681531994,
      sunset: 1681573015,
    },
    timezone: 7200,
    id: 1021360,
    name: 'Ballitoville',
    cod: 200,
  };

  const forecastData = {
    cod: '200',
    message: 0,
    cnt: 40,
    list: [
      {
        dt: 1681484400,
        main: {
          temp: 22.25,
          feels_like: 22.05,
          temp_min: 21.47,
          temp_max: 22.25,
          pressure: 1018,
          sea_level: 1018,
          grnd_level: 1007,
          humidity: 58,
          temp_kf: 0.78,
        },
        weather: [
          {
            id: 804,
            main: 'Clouds',
            description: 'overcast clouds',
            icon: '04d',
          },
        ],
        clouds: {all: 100},
        wind: {speed: 11.34, deg: 196, gust: 13.79},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-14 15:00:00',
      },
      {
        dt: 1681495200,
        main: {
          temp: 21.77,
          feels_like: 21.49,
          temp_min: 20.81,
          temp_max: 21.77,
          pressure: 1019,
          sea_level: 1019,
          grnd_level: 1010,
          humidity: 57,
          temp_kf: 0.96,
        },
        weather: [
          {
            id: 804,
            main: 'Clouds',
            description: 'overcast clouds',
            icon: '04n',
          },
        ],
        clouds: {all: 100},
        wind: {speed: 11.4, deg: 201, gust: 16.45},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-14 18:00:00',
      },
      {
        dt: 1681506000,
        main: {
          temp: 19.66,
          feels_like: 18.99,
          temp_min: 18.36,
          temp_max: 19.66,
          pressure: 1022,
          sea_level: 1022,
          grnd_level: 1013,
          humidity: 50,
          temp_kf: 1.3,
        },
        weather: [
          {
            id: 802,
            main: 'Clouds',
            description: 'scattered clouds',
            icon: '03n',
          },
        ],
        clouds: {all: 45},
        wind: {speed: 8.02, deg: 226, gust: 13.45},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-14 21:00:00',
      },
      {
        dt: 1681516800,
        main: {
          temp: 15.34,
          feels_like: 14.42,
          temp_min: 15.34,
          temp_max: 15.34,
          pressure: 1025,
          sea_level: 1025,
          grnd_level: 1013,
          humidity: 57,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Sun', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 9},
        wind: {speed: 4.84, deg: 237, gust: 8.22},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-15 00:00:00',
      },
      {
        dt: 1681527600,
        main: {
          temp: 13.61,
          feels_like: 12.67,
          temp_min: 13.61,
          temp_max: 13.61,
          pressure: 1025,
          sea_level: 1025,
          grnd_level: 1013,
          humidity: 63,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Sun', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 0},
        wind: {speed: 3.02, deg: 275, gust: 3.87},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-15 03:00:00',
      },
      {
        dt: 1681538400,
        main: {
          temp: 17.13,
          feels_like: 16.23,
          temp_min: 17.13,
          temp_max: 17.13,
          pressure: 1026,
          sea_level: 1026,
          grnd_level: 1015,
          humidity: 51,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Sun', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 0},
        wind: {speed: 1.96, deg: 261, gust: 2.7},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-15 06:00:00',
      },
      {
        dt: 1681549200,
        main: {
          temp: 21.22,
          feels_like: 20.44,
          temp_min: 21.22,
          temp_max: 21.22,
          pressure: 1026,
          sea_level: 1026,
          grnd_level: 1015,
          humidity: 40,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Sun', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 0},
        wind: {speed: 4.12, deg: 178, gust: 5.05},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-15 09:00:00',
      },
      {
        dt: 1681560000,
        main: {
          temp: 21.88,
          feels_like: 21.3,
          temp_min: 21.88,
          temp_max: 21.88,
          pressure: 1024,
          sea_level: 1024,
          grnd_level: 1012,
          humidity: 45,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Sun', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 0},
        wind: {speed: 4.98, deg: 164, gust: 4.49},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-15 12:00:00',
      },
      {
        dt: 1681570800,
        main: {
          temp: 20.28,
          feels_like: 19.93,
          temp_min: 20.28,
          temp_max: 20.28,
          pressure: 1024,
          sea_level: 1024,
          grnd_level: 1013,
          humidity: 60,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Sun', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 0},
        wind: {speed: 3.27, deg: 179, gust: 4.23},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-15 15:00:00',
      },
      {
        dt: 1681581600,
        main: {
          temp: 17.21,
          feels_like: 16.89,
          temp_min: 17.21,
          temp_max: 17.21,
          pressure: 1025,
          sea_level: 1025,
          grnd_level: 1013,
          humidity: 73,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Sun', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 0},
        wind: {speed: 2.09, deg: 266, gust: 2.58},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-15 18:00:00',
      },
      {
        dt: 1681592400,
        main: {
          temp: 16.17,
          feels_like: 15.8,
          temp_min: 16.17,
          temp_max: 16.17,
          pressure: 1025,
          sea_level: 1025,
          grnd_level: 1013,
          humidity: 75,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 0},
        wind: {speed: 3.12, deg: 295, gust: 3.15},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-15 21:00:00',
      },
      {
        dt: 1681603200,
        main: {
          temp: 15.56,
          feels_like: 15.1,
          temp_min: 15.56,
          temp_max: 15.56,
          pressure: 1023,
          sea_level: 1023,
          grnd_level: 1012,
          humidity: 74,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 4},
        wind: {speed: 2.99, deg: 301, gust: 2.96},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-16 00:00:00',
      },
      {
        dt: 1681614000,
        main: {
          temp: 14.93,
          feels_like: 14.31,
          temp_min: 14.93,
          temp_max: 14.93,
          pressure: 1023,
          sea_level: 1023,
          grnd_level: 1011,
          humidity: 70,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 2},
        wind: {speed: 2.43, deg: 306, gust: 2.34},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-16 03:00:00',
      },
      {
        dt: 1681624800,
        main: {
          temp: 17.97,
          feels_like: 17.31,
          temp_min: 17.97,
          temp_max: 17.97,
          pressure: 1023,
          sea_level: 1023,
          grnd_level: 1011,
          humidity: 57,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 1},
        wind: {speed: 1.67, deg: 314, gust: 1.88},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-16 06:00:00',
      },
      {
        dt: 1681635600,
        main: {
          temp: 22.08,
          feels_like: 21.6,
          temp_min: 22.08,
          temp_max: 22.08,
          pressure: 1021,
          sea_level: 1021,
          grnd_level: 1010,
          humidity: 48,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 1},
        wind: {speed: 3.6, deg: 72, gust: 3.54},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-16 09:00:00',
      },
      {
        dt: 1681646400,
        main: {
          temp: 22.77,
          feels_like: 22.46,
          temp_min: 22.77,
          temp_max: 22.77,
          pressure: 1018,
          sea_level: 1018,
          grnd_level: 1007,
          humidity: 52,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 1},
        wind: {speed: 5.29, deg: 77, gust: 4.86},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-16 12:00:00',
      },
      {
        dt: 1681657200,
        main: {
          temp: 21.37,
          feels_like: 21.21,
          temp_min: 21.37,
          temp_max: 21.37,
          pressure: 1018,
          sea_level: 1018,
          grnd_level: 1007,
          humidity: 63,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 1},
        wind: {speed: 3.75, deg: 58, gust: 4.73},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-16 15:00:00',
      },
      {
        dt: 1681668000,
        main: {
          temp: 18.06,
          feels_like: 17.98,
          temp_min: 18.06,
          temp_max: 18.06,
          pressure: 1019,
          sea_level: 1019,
          grnd_level: 1007,
          humidity: 79,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 1},
        wind: {speed: 3.04, deg: 349, gust: 4.17},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-16 18:00:00',
      },
      {
        dt: 1681678800,
        main: {
          temp: 16.87,
          feels_like: 16.73,
          temp_min: 16.87,
          temp_max: 16.87,
          pressure: 1019,
          sea_level: 1019,
          grnd_level: 1007,
          humidity: 81,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 2},
        wind: {speed: 2.32, deg: 344, gust: 3.26},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-16 21:00:00',
      },
      {
        dt: 1681689600,
        main: {
          temp: 16.07,
          feels_like: 15.82,
          temp_min: 16.07,
          temp_max: 16.07,
          pressure: 1017,
          sea_level: 1017,
          grnd_level: 1005,
          humidity: 80,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 3},
        wind: {speed: 2.32, deg: 340, gust: 2.67},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-17 00:00:00',
      },
      {
        dt: 1681700400,
        main: {
          temp: 15.97,
          feels_like: 15.63,
          temp_min: 15.97,
          temp_max: 15.97,
          pressure: 1016,
          sea_level: 1016,
          grnd_level: 1004,
          humidity: 77,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 5},
        wind: {speed: 1.99, deg: 338, gust: 2.22},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-17 03:00:00',
      },
      {
        dt: 1681711200,
        main: {
          temp: 19.58,
          feels_like: 19.21,
          temp_min: 19.58,
          temp_max: 19.58,
          pressure: 1016,
          sea_level: 1016,
          grnd_level: 1004,
          humidity: 62,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 7},
        wind: {speed: 2.02, deg: 356, gust: 2.6},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-17 06:00:00',
      },
      {
        dt: 1681722000,
        main: {
          temp: 25.7,
          feels_like: 25.63,
          temp_min: 25.7,
          temp_max: 25.7,
          pressure: 1014,
          sea_level: 1014,
          grnd_level: 1003,
          humidity: 50,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 7},
        wind: {speed: 3.73, deg: 60, gust: 3.85},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-17 09:00:00',
      },
      {
        dt: 1681732800,
        main: {
          temp: 27.07,
          feels_like: 27.88,
          temp_min: 27.07,
          temp_max: 27.07,
          pressure: 1011,
          sea_level: 1011,
          grnd_level: 1000,
          humidity: 56,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 7},
        wind: {speed: 5.51, deg: 66, gust: 6.34},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-17 12:00:00',
      },
      {
        dt: 1681743600,
        main: {
          temp: 24.05,
          feels_like: 24.55,
          temp_min: 24.05,
          temp_max: 24.05,
          pressure: 1011,
          sea_level: 1011,
          grnd_level: 1000,
          humidity: 78,
          temp_kf: 0,
        },
        weather: [
          {id: 801, main: 'Clouds', description: 'few clouds', icon: '02d'},
        ],
        clouds: {all: 23},
        wind: {speed: 5.32, deg: 44, gust: 7.9},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-17 15:00:00',
      },
      {
        dt: 1681754400,
        main: {
          temp: 21.64,
          feels_like: 21.9,
          temp_min: 21.64,
          temp_max: 21.64,
          pressure: 1013,
          sea_level: 1013,
          grnd_level: 1002,
          humidity: 78,
          temp_kf: 0,
        },
        weather: [
          {id: 801, main: 'Clouds', description: 'few clouds', icon: '02n'},
        ],
        clouds: {all: 14},
        wind: {speed: 3.21, deg: 13, gust: 4.65},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-17 18:00:00',
      },
      {
        dt: 1681765200,
        main: {
          temp: 20.51,
          feels_like: 20.16,
          temp_min: 20.51,
          temp_max: 20.51,
          pressure: 1013,
          sea_level: 1013,
          grnd_level: 1002,
          humidity: 59,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 0},
        wind: {speed: 2.27, deg: 348, gust: 2.57},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-17 21:00:00',
      },
      {
        dt: 1681776000,
        main: {
          temp: 20.12,
          feels_like: 19.55,
          temp_min: 20.12,
          temp_max: 20.12,
          pressure: 1013,
          sea_level: 1013,
          grnd_level: 1001,
          humidity: 52,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 0},
        wind: {speed: 2.54, deg: 350, gust: 2.81},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-18 00:00:00',
      },
      {
        dt: 1681786800,
        main: {
          temp: 19.74,
          feels_like: 18.97,
          temp_min: 19.74,
          temp_max: 19.74,
          pressure: 1013,
          sea_level: 1013,
          grnd_level: 1002,
          humidity: 46,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 0},
        wind: {speed: 1.95, deg: 339, gust: 2.05},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-18 03:00:00',
      },
      {
        dt: 1681797600,
        main: {
          temp: 23.66,
          feels_like: 23.23,
          temp_min: 23.66,
          temp_max: 23.66,
          pressure: 1014,
          sea_level: 1014,
          grnd_level: 1003,
          humidity: 44,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 2},
        wind: {speed: 1.91, deg: 344, gust: 2.9},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-18 06:00:00',
      },
      {
        dt: 1681808400,
        main: {
          temp: 29.2,
          feels_like: 28.91,
          temp_min: 29.2,
          temp_max: 29.2,
          pressure: 1014,
          sea_level: 1014,
          grnd_level: 1003,
          humidity: 41,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Sun', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 2},
        wind: {speed: 4.21, deg: 47, gust: 4.3},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-18 09:00:00',
      },
      {
        dt: 1681819200,
        main: {
          temp: 29.32,
          feels_like: 30.08,
          temp_min: 29.32,
          temp_max: 29.32,
          pressure: 1012,
          sea_level: 1012,
          grnd_level: 1001,
          humidity: 50,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 2},
        wind: {speed: 6.08, deg: 58, gust: 7.12},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-18 12:00:00',
      },
      {
        dt: 1681830000,
        main: {
          temp: 25.84,
          feels_like: 26.23,
          temp_min: 25.84,
          temp_max: 25.84,
          pressure: 1013,
          sea_level: 1013,
          grnd_level: 1001,
          humidity: 67,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 0},
        wind: {speed: 4.99, deg: 37, gust: 7.15},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-18 15:00:00',
      },
      {
        dt: 1681840800,
        main: {
          temp: 23.4,
          feels_like: 23.39,
          temp_min: 23.4,
          temp_max: 23.4,
          pressure: 1014,
          sea_level: 1014,
          grnd_level: 1003,
          humidity: 61,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 0},
        wind: {speed: 3.69, deg: 22, gust: 5},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-18 18:00:00',
      },
      {
        dt: 1681851600,
        main: {
          temp: 22.27,
          feels_like: 21.86,
          temp_min: 22.27,
          temp_max: 22.27,
          pressure: 1014,
          sea_level: 1014,
          grnd_level: 1003,
          humidity: 50,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 0},
        wind: {speed: 2.65, deg: 352, gust: 3.06},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-18 21:00:00',
      },
      {
        dt: 1681862400,
        main: {
          temp: 20.66,
          feels_like: 20.92,
          temp_min: 20.66,
          temp_max: 20.66,
          pressure: 1015,
          sea_level: 1015,
          grnd_level: 1004,
          humidity: 82,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 0},
        wind: {speed: 4.28, deg: 213, gust: 6.94},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-19 00:00:00',
      },
      {
        dt: 1681873200,
        main: {
          temp: 19.39,
          feels_like: 19.26,
          temp_min: 19.39,
          temp_max: 19.39,
          pressure: 1016,
          sea_level: 1016,
          grnd_level: 1005,
          humidity: 72,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01n'},
        ],
        clouds: {all: 3},
        wind: {speed: 1.72, deg: 271, gust: 2.54},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'n'},
        dt_txt: '2023-04-19 03:00:00',
      },
      {
        dt: 1681884000,
        main: {
          temp: 21.93,
          feels_like: 21.61,
          temp_min: 21.93,
          temp_max: 21.93,
          pressure: 1017,
          sea_level: 1017,
          grnd_level: 1006,
          humidity: 55,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 1},
        wind: {speed: 2.07, deg: 1, gust: 2.55},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-19 06:00:00',
      },
      {
        dt: 1681894800,
        main: {
          temp: 26.05,
          feels_like: 26.05,
          temp_min: 26.05,
          temp_max: 26.05,
          pressure: 1017,
          sea_level: 1017,
          grnd_level: 1005,
          humidity: 57,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 0},
        wind: {speed: 4.56, deg: 63, gust: 4.85},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-19 09:00:00',
      },
      {
        dt: 1681905600,
        main: {
          temp: 26.3,
          feels_like: 26.3,
          temp_min: 26.3,
          temp_max: 26.3,
          pressure: 1014,
          sea_level: 1014,
          grnd_level: 1003,
          humidity: 66,
          temp_kf: 0,
        },
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01d'},
        ],
        clouds: {all: 0},
        wind: {speed: 5.83, deg: 61, gust: 6.58},
        visibility: 10000,
        pop: 0,
        sys: {pod: 'd'},
        dt_txt: '2023-04-19 12:00:00',
      },
    ],
    city: {
      id: 1021360,
      name: 'Ballitoville',
      coord: {lat: -29.5271, lon: 31.2129},
      country: 'ZA',
      population: 17218,
      timezone: 7200,
      sunrise: 1681445559,
      sunset: 1681486680,
    },
  };

  useEffect(() => {
    displayWeatherForecast();

    // Testing purpose
    // getCurrentLocation().then(async () => {
    //   // favouriteID.current = await GetAsyncStorageData('ID');
    //   mainTemp.current = Math.floor(weatherData.main.temp);
    //   weatherType.current = weatherData.weather[0].main;
    //   minTemp.current = Math.floor(weatherData.main.temp_min);
    //   maxTemp.current = Math.floor(weatherData.main.temp_max);
    //   changeBackground();
    //   setisLoading(false);
    //   filterForecast(forecastData);
    // });
  }, [permission]);

  const displayWeatherForecast = () => {
    getCurrentLocation().then(() => {
      // GetCurrentWeather(lat.current, long.current);
      // GetCurrentWeather('-29.5270784', '31.2129082');
      GetCurrentWeather(lat.current, long.current).then(res => {
        //  console.log('DD' + JSON.stringify(res.data));
        mainTemp.current = Math.floor(res.data.main.temp);
        weatherType.current = res.data.weather[0].main;
        minTemp.current = Math.floor(res.data.main.temp_min);
        maxTemp.current = Math.floor(res.data.main.temp_max);
        changeBackground();
      });
      // Getting 5 days forecast
      GetWeatherForecast(lat.current, long.current).then(res => {
        filterForecast(res.data);
      });
      setisLoading(false);
    });
  };

  const changeBackground = () => {
    if (weatherType.current === 'Sun') {
      setWeatherImage(require('../assets/Images/forest_sunny.png'));
      setBackgorundColor(hexColors.sunny);
    } else if (weatherType.current === 'Rain') {
      setWeatherImage(require('../assets/Images/forest_rainy.png'));
      setBackgorundColor(hexColors.rainy);
    } else if (weatherType.current === 'Clouds') {
      setWeatherImage(require('../assets/Images/forest_cloudy.png'));
      setBackgorundColor(hexColors.cloudy);
    }
  };

  // using geolocation api
  const getCurrentLocation = async () => {
    // getting location based on OS
    if (Platform.OS === 'android') {
      const result = requestLocationPermission();
      result.then(async res => {
        if (res) {
          // if response is true setting display

          Geolocation.getCurrentPosition(
            position => {
              // getting longitude and saving reference
              long.current = position.coords.longitude.toString();

              //getting the Latitude from the location json
              lat.current = position.coords.latitude.toString();
              //  console.log(long.current, lat.current);
              setPermission(true);
            },
            error => {
              // See error code charts below.
              console.log(error.code, 'Error ' + error.message);
              if (error.code == 2) {
                alert('Please turn on your location');
              }
              return error;
            },
            {enableHighAccuracy: false, timeout: 5000, maximumAge: 3600000},
          );
        }
      });
    } else {
      Geolocation.getCurrentPosition(
        position => {
          // getting longitude and saving reference
          long.current = position.coords.longitude.toString();

          //getting the Latitude from the location json
          lat.current = position.coords.latitude.toString();
          //  console.log(long.current, lat.current);
          setPermission(true);
        },
        error => {
          // See error code charts below.
          console.log(error.code, 'Error ' + error.message);
          if (error.code == 2) {
            alert('Please turn on your location');
          }
          return error;
        },
        {enableHighAccuracy: false, timeout: 2000, maximumAge: 3600000},
      );
    }
  };

  const filterForecast = data => {
    let id = 1; // for generating id's for object
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let weatherdataArray = [];
    data.list.map(data => {
      const date = new Date(data.dt_txt);

      dataobj = {
        id,
        day: days[date.getDay()], // getting days from day array
        temprature: Math.floor(data.main.temp),
        weather: data.weather[0].main,
      };
      weatherdataArray.push(dataobj);
      id++;
    });

    const forecast = weatherdataArray.filter((fil, index) => {
      return index === weatherdataArray.findIndex(obj => obj.day === fil.day);
    });
    setForecast(forecast);
    console.log(forecast);
  };

  const addIcons = val => {
    if (val === 'Clear') {
      return require('../assets/icons/clearxx.png');
    }
    if (val === 'Sun') {
      return require('../assets/icons/partlysunnyxx.png');
    }
    if (val === 'Clouds' || val === 'Rain') {
      return require('../assets/icons/rainxx.png');
    }
  };

  const renderItem = item => {
    return (
      <View style={styles.forecastItemContainer}>
        <View style={styles.forecastRowContainer}>
          <View style={styles.forecastDayStyle}>
            <Text style={styles.forecastRowTextStyle}>{item.day}</Text>
          </View>
          <View style={styles.forecastWeatherContainer}>
            <Image
              source={addIcons(item.weather)}
              style={styles.forecastRowTextStyle}
            />
          </View>
          <View style={styles.forecastTempratureContainer}>
            <Text style={styles.forecastRowTextStyle}>
              {item.temprature} {'\u00b0'}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  const renderSeparator = () => {
    return <View style={styles.rowSepratorStyle} />;
  };

  const addtoFavourites = async () => {
    const favID = await GetAsyncStorageData('ID');
    const dataObj = {
      ID: parseInt(favID) + 1,
      Latitude: lat.current,
      Longitude: long.current,
      PersonID: 1, // We dont have a login or user ID specified for demo its jsut 1
    };
    if (!favourite) {
      // Adding to favourite list and seding to firestore
      setFavourite(true);
      usersCollection.add(dataObj);
      await SaveAsyncStorage('ID', dataObj.ID);
    } else {
      setFavourite(false);
    }
  };

  return (
    <View style={[styles.mainContainer, {backgroundColor: appbackgroundColor}]}>
      {permission && !isLoading ? (
        <>
          <View style={styles.weatherImageContainer}>
            <Image style={styles.weatherImageStyle} source={weatherImage} />

            <View style={styles.menuIconContainer}>
              <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
                <Image
                  style={styles.menuImageStyle}
                  source={require('../assets/icons/menuicon.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.starIconContainer}>
              <TouchableOpacity onPress={() => addtoFavourites()}>
                {!favourite ? (
                  <Image
                    style={styles.menuImageStyle}
                    source={require('../assets/icons/star.png')}
                  />
                ) : (
                  <Image
                    style={styles.menuImageStyle}
                    source={require('../assets/icons/starselected.png')}
                  />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.mainTemp}>
              <Text style={styles.mainTempTextStyle}>
                {mainTemp.current}
                {'\u00b0'}
              </Text>
            </View>
            <View style={styles.mainWeatherType}>
              <Text style={styles.mainWeatherTypeStyle}>
                {weatherType.current}
              </Text>
            </View>
          </View>
          <View style={styles.tempBar}>
            <View style={styles.tempBarMinStyle}>
              <Text style={styles.tempBarMinHeaderStyle}>
                {minTemp.current}
                {'\u00b0'}
              </Text>
              <Text style={styles.tempBarMinHeaderStyle}>MIN</Text>
            </View>
            <View style={styles.tempBarCurrentStyle}>
              <Text style={styles.tempBarCurrentHeaderStyle}>
                {mainTemp.current}
                {'\u00b0'}
              </Text>
              <Text style={styles.tempBarCurrentHeaderStyle}>CURRENT</Text>
            </View>
            <View style={styles.tempBarMaxStyle}>
              <Text style={styles.tempBarCurrentHeaderStyle}>
                {maxTemp.current}
                {'\u00b0'}
              </Text>
              <Text style={styles.tempBarCurrentHeaderStyle}>MAX</Text>
            </View>
          </View>
          <View style={styles.sepratorStyle} />
          <View style={styles.forecastContainer}>
            <FlatList
              style={{flex: 1}}
              data={forecast}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => renderItem(item)}
              ItemSeparatorComponent={renderSeparator}
            />
          </View>
        </>
      ) : (
        <LoadingIndicator />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  weatherImageContainer: {
    flex: 0.5,
  },
  weatherImageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  menuIconContainer: {
    position: 'absolute',
    left: 10,
    right: 0,
    top: 15,
    backgroundColor: 'transparent',
  },
  starIconContainer: {
    position: 'absolute',
    top: 15,
    right: 8,
    backgroundColor: 'transparent',
  },
  menuImageStyle: {width: 40, height: 40, padding: 5},
  mainTemp: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 80,
    backgroundColor: 'transparent',
  },
  mainWeatherType: {
    position: 'absolute',
    left: 0,
    right: 25,
    top: 180,
    backgroundColor: 'transparent',
  },
  mainTempTextStyle: {
    alignSelf: 'center',
    fontSize: 80,
    color: hexColors.textColor,
    fontWeight: 'bold',
  },
  mainWeatherTypeStyle: {
    alignSelf: 'center',
    fontSize: 40,
    color: hexColors.textColor,
    fontWeight: 'normal',
  },
  tempBar: {
    flex: 0.08,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  tempBarMinStyle: {
    flex: 0.4,
    flexDirection: 'column',
  },
  tempBarMinHeaderStyle: {
    fontSize: 18,
    color: hexColors.textColor,
    fontWeight: 'normal',
  },
  tempBarCurrentStyle: {
    flex: 0.8,
    flexDirection: 'column',
  },
  tempBarMaxStyle: {
    flex: 0.5,

    flexDirection: 'column',
  },
  tempBarCurrentHeaderStyle: {
    fontSize: 18,
    textAlign: 'center',
    color: hexColors.textColor,
    fontWeight: 'normal',
  },
  sepratorStyle: {
    padding: 0.8,
    height: 1,
    width: '100%',
    backgroundColor: hexColors.textColor,
  },
  rowSepratorStyle: {
    padding: 10,
    height: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  forecastContainer: {
    flex: 0.4,
    marginHorizontal: 5,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  forecastItemContainer: {
    flex: 1,
  },
  forecastRowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  forecastRowStyle: {
    flex: 1,
  },
  forecastDayStyle: {flex: 0.37, paddingLeft: 10},
  forecastWeatherContainer: {
    flex: 0.45,
    paddingRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forecastTempratureContainer: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forecastRowTextStyle: {
    fontSize: 22,
    justifyContent: 'center',
    color: hexColors.textColor,
    fontWeight: 'normal',
  },
});

export default HomeScreen;
