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

  useEffect(() => {
    displayWeatherForecast();
  }, [permission]);

  const displayWeatherForecast = () => {
    getCurrentLocation().then(() => {
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
