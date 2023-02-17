import { ICoordinates } from "./coordinates";

export interface IWeatherLocationTimestamped extends IWeatherLocation {
  lastUpdated: number;
}

export interface IWeatherLocation {
  /** City name */
  name: string;
  /** Internal API parameter */
  base: string;
  /** Time of data calculation, unix, UTC */
  dt: number;
  /** Shift in seconds from UTC */
  timezone: number;
  /** Cloudiness, % */
  clouds: IClouds;
  /** City geolocation, longitude and latitude */
  coord: ICoordinates;
  main: IWeatherLocationMain;
  /** Visibility, meter. The maximum value of the visibility is 10km */
  visibility: number;
  wind: IWind;
  rain: TRain;
}

interface IClouds {
  /** Cloudiness, % */
  all: number;
}

interface IWind {
  /** Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour. */
  speed: number;
  /** Wind direction, degrees (meteorological) */
  deg: number;
  /** Wind gust. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour */
  gust: number;
}

interface IWeatherLocationMain {
  /** Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit. */
  temp: number;
  /** Temperature.
   * This temperature parameter accounts for the human perception of weather.
   * Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
   * */
  feels_like: number;
  /** Atmospheric pressure (on the sea level, if there is no sea_level or grnd_level data), hPa */
  pressure: number;
  /** Humidity, % */
  humidity: number;
  /** Minimum temperature at the moment.
   * This is minimal currently observed temperature (within large megalopolises and urban areas).
   * Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
   * */
  temp_min: number;
  /** Maximum temperature at the moment.
   * This is maximal currently observed temperature (within large megalopolises and urban areas).
   * Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
   * */
  temp_max: number;
  /** Atmospheric pressure on the sea level, hPa */
  sea_level: number;
  /** Atmospheric pressure on the ground level, hPa */
  grnd_level: number;
}

type TRain = {
  [key in TTimeInterval]: number;
};

type TTimeInterval = "1h" | "3h";
