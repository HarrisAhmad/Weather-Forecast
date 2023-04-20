import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/';
const GEO_URL = 'https://us1.locationiq.com/v1/';

export const axiosConfig = axios.create({
  baseURL: BASE_URL,
});

export const axiosGeoConfig = axios.create({
  baseURL: GEO_URL,
});
