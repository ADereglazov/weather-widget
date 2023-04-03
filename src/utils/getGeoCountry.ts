import { getWeatherFromGeo } from "@/services/fetchWeather";
import {
  COUNTRIES,
  ICoordinates,
  TGeoCountry,
  TLanguage,
  TUnits,
} from "@/types";

export async function getGeoCountry(
  geo: ICoordinates,
  props: {
    lang: TLanguage;
    units: TUnits;
    apiUrl: string;
    apiKey: string;
  }
): Promise<TGeoCountry | null> {
  const { location } = await getWeatherFromGeo(geo, props);

  if (location && location?.sys?.country) {
    const country = location.sys.country.toLowerCase();

    if (COUNTRIES.includes(country as TGeoCountry)) {
      return country as TGeoCountry;
    }
  }

  return null;
}
