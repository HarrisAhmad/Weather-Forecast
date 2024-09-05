import {axiosConfig, axiosGeoConfig} from '../configuration/axiosConfig';
import {API_KEY, APP_ID} from '@env';

/////////////////////////////////////////////////// CURRENT WEATHER //////////////////////////////////////////////////
const appid = 'd268608c0ec4e46d1d69f2c404e236b7'; // exposed for demo purpose
const units = 'Metric';
export const GetCurrentWeather = async (lat, lon) => {
  let result = '';
  await axiosConfig
    .post('data/2.5/weather', null, {
      params: {
        lat,
        lon,
        appid,
        units,
      },
    })

    .then(response => {
      return response;
    })
    .then(res => {
      result = res;
    })

    .catch(error => {
      console.log(error);
    });

  return result;
};

/////////////////////////////////////////////////// FORECAST //////////////////////////////////////////////////

export const GetWeatherForecast = async (lat, lon) => {
  let result = '';
  await axiosConfig
    .post('data/2.5/forecast', null, {
      params: {
        lat,
        lon,
        appid,
        units,
      },
    })

    .then(response => {
      return response;
    })
    .then(res => {
      result = res;
    })

    .catch(error => {
      console.log(error);
    });

  return result;
};

//////////////////////////////// REVERSE GEOCODE ///////////////////////////////////////////////////////////

export const GetReverseGeocode = async (lat, lon) => {
  let result = '';
  await axiosGeoConfig
    .post('reverse', null, {
      params: {
        key: API_KEY,
        lat,
        lon,
        format: 'json',
      },
    })

    .then(response => {
      return response;
    })
    .then(res => {
      result = res;
    })

    .catch(error => {
      console.log(error);
    });

  return result;
};
