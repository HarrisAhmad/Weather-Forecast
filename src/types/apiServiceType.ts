export interface IWeatherDataResponse {
  data: {
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: [{main: string}];
  };
}

export interface IWeatherProps {
  id: number;
  main: string;
  description?: string;
  icon?: string;
}

export interface IWeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: IWeatherProps[];
    clouds: {all: number};
    wind: {speed: number; deg: number; gust: number};
    visibility: number;
    pop: number;
    sys: {pod: string};
    dt_txt: string;
  }[];
}

export interface IAddressProps {
  state: string;
  town: string;
}
export interface IReverseGeocodeResponse {
  address: IAddressProps;
}
