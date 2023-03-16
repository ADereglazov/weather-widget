import { dict } from "@/locales";
import { ICoordinates, TLanguage, TUnits } from "@/types";
import {
  IGetWeatherFetchFailed,
  TGetWeatherFetchSucceed,
  IGetWeatherFromGeoParameters,
  TGetWeatherResult,
  IGetWeatherSucceed,
} from "./types";

export async function getWeatherFromGeo(
  coordinates: ICoordinates,
  props: {
    lang: TLanguage;
    units: TUnits;
    apiUrl: string;
    apiKey: string;
  }
): Promise<{ location: IGetWeatherSucceed | null; message: string }> {
  try {
    const result = await getWeather({
      coordinates,
      lang: props.lang,
      units: props.units,
      apiUrl: props.apiUrl,
      apiKey: props.apiKey,
    });

    if (result.status !== "succeed") {
      const message = `${dict[props.lang].oops} ${result.message}, ${
        dict[props.lang].tryReload
      }`;
      console.error(message);

      return { location: null, message };
    }

    return { location: result, message: "" };
  } catch (e) {
    const message = `${dict[props.lang].oops} ${
      dict[props.lang].somethingWentWrong
    }, ${dict[props.lang].tryReload}`;
    console.error(e);

    return { location: null, message };
  }
}
async function getWeather({
  coordinates,
  lang = "en",
  units = "metric",
  apiUrl,
  apiKey,
}: IGetWeatherFromGeoParameters): Promise<TGetWeatherResult> {
  const requestUrl = new URL(`${apiUrl}/weather/`);
  requestUrl.searchParams.set("lat", String(coordinates.lat));
  requestUrl.searchParams.set("lon", String(coordinates.lon));
  requestUrl.searchParams.set("lang", lang);
  requestUrl.searchParams.set("units", units);
  requestUrl.searchParams.set("appid", apiKey);

  const response = await fetch(requestUrl.toString());

  if (!response.ok) {
    const responseJson: IGetWeatherFetchFailed = await response.json();

    return {
      status: "failed",
      message: responseJson.message || "",
    };
  }

  const responseJson: TGetWeatherFetchSucceed = await response.json();

  return {
    ...responseJson,
    status: "succeed",
    lastUpdated: Date.now(),
  };
}
